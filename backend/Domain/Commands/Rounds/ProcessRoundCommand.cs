using Domain.Context;
using Domain.Services.Games;
using Domain.Services.Rounds;
using Models;
using Models.Rounds;
using Models.Rounds.History;
using Models.Settings;

namespace Domain.Commands.Rounds;

public class ProcessRoundCommand : IProcessRoundCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IRoundsService roundsService;
    private readonly IGamesService gamesService;

    public ProcessRoundCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService,
        IGamesService gamesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
        this.gamesService = gamesService;
    }

    public async Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid roundId, RoundState state, Guid? teamId, bool isStartAction)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<Round, InvalidRoundDataReason>>(
            async dbContext =>
            {
                var round = await roundsService.FindAsync(roundId);
                if (round == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not found");

                if (round.CurrentState == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not started");

                var game = (await gamesService.FindAsync(round.GameId))!;
                switch (state)
                {
                    case RoundState.None:
                    case RoundState.Complete:
                    case RoundState.Mark:
                        break;
                    case RoundState.Prepare:
                        if (!await TryProcessPrepareState(round, isStartAction))
                            return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't start/stop prepare");
                        break;
                    case RoundState.Presentation:
                        if (!await TryProcessPresentationState(round, teamId!.Value, isStartAction))
                            return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't start/stop presentation");
                        break;
                    case RoundState.Defense:
                        if (!await TryProcessDefenceState(round, teamId!.Value, isStartAction))
                            return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't start/stop presentation");
                        break;
                    case RoundState.Pause:
                        if (!await TryProcessPauseState(game.Settings, round, teamId!.Value, isStartAction))
                            return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't start/stop pause");
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(state), state, null);
                }

                await dbContext.SaveChangesAsync();
                round = await roundsService.FindAsync(roundId);
                return round!;
            });

        return result;
    }

    private async Task<bool> TryProcessPauseState(Settings settings, Round round, Guid teamId, bool isStartAction)
    {
        var pausesCount = round.History.Count(
            x => x.State == RoundState.Pause
                 && ((PauseRoundHistoryItem)x.Value).TeamId == teamId);
        if (pausesCount > settings.TimeoutsCount || pausesCount == settings.TimeoutsCount && isStartAction)
            return false;

        if (isStartAction)
        {
            await roundsService.AddHistoryItem(
                round.Id,
                new HistoryItem
                {
                    Value = new PauseRoundHistoryItem
                    {
                        TeamId = teamId,
                        Start = DateTimeOffset.Now
                    }
                });
        }
        else
        {
            var lastPause = round.History
                .Where(x => x.State == RoundState.Pause)
                .MaxBy(x => x.Order);

            if (lastPause == null)
                throw new EntityNotFoundException("No one pauses used");

            ((PauseRoundHistoryItem)lastPause.Value).End = DateTimeOffset.Now;
            round = await roundsService.UpdateCurrentHistory(round);
            var lastNotPauseItem = round.History
                .Where(x => x.State != RoundState.Pause)
                .MaxBy(x => x.Order);

            if (lastNotPauseItem?.Value.Start != null)
            {
                var timeToAdd = ((PauseRoundHistoryItem)lastPause.Value).End - ((PauseRoundHistoryItem)lastPause.Value).Start;
                lastNotPauseItem.Value.Start += timeToAdd;
            }

            await roundsService.AddHistoryItem(round.Id, lastNotPauseItem!);
        }

        return true;
    }

    private async Task<bool> TryProcessPrepareState(Round round, bool isStartAction)
    {
        var prepare = round.History.LastOrDefault(x => x.State == RoundState.Prepare);
        if (prepare == null)
            return false;

        if (isStartAction)
        {
            prepare.Value.Start = DateTimeOffset.Now;
        }
        else
        {
            prepare.Value.End = DateTimeOffset.Now;
            round = await roundsService.UpdateCurrentHistory(round);
            await roundsService.AddHistoryItem(
                round.Id,
                new()
                {
                    Value = new PresentationRoundHistoryItem()
                });
        }

        return true;
    }

    private async Task<bool> TryProcessPresentationState(Round round, Guid teamId, bool isStartAction)
    {
        var prepare = round.History.SingleOrDefault(x => x.State == RoundState.Prepare);
        if (prepare == null)
            return false;

        if (isStartAction)
        {
            prepare.Value.Start = DateTimeOffset.Now;
            ((PresentationRoundHistoryItem)prepare.Value).TeamId = teamId;
            await roundsService.UpdateCurrentHistory(round);
        }
        else
        {
            prepare.Value.End = DateTimeOffset.Now;
            round = await roundsService.UpdateCurrentHistory(round);
            await roundsService.AddHistoryItem(
                round.Id,
                new()
                {
                    Value = new DefenseRoundHistoryItem
                    {
                        TeamId = teamId
                    }
                });
        }

        return true;
    }

    private async Task<bool> TryProcessDefenceState(Round round, Guid teamId, bool isStartAction)
    {
        var prepare = round.History.LastOrDefault(
            x => x.State == RoundState.Presentation
                 && ((PauseRoundHistoryItem)x.Value).TeamId == teamId);
        if (prepare == null)
            return false;

        if (isStartAction)
        {
            prepare.Value.Start = DateTimeOffset.Now;
            await roundsService.UpdateCurrentHistory(round);
        }
        else
        {
            prepare.Value.End = DateTimeOffset.Now;
            round = await roundsService.UpdateCurrentHistory(round);

            if (round.History.Count(x => x is {State: RoundState.Defense, Value.End: not null}) == 2)
            {
                await roundsService.AddHistoryItem(
                    round.Id,
                    new()
                    {
                        Value = new MarkRoundHistoryItem()
                    });
            }
            else
            {
                await roundsService.AddHistoryItem(
                    round.Id,
                    new()
                    {
                        Value = new PresentationRoundHistoryItem()
                        {
                            TeamId = teamId
                        }
                    });
            }
        }

        return true;
    }
}