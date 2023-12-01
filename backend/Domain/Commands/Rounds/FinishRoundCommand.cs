using Domain.Context;
using Domain.Services.Games;
using Domain.Services.Rounds;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models;
using Models.Games;
using Models.Rounds;
using Models.Rounds.History;
using Newtonsoft.Json.Serialization;

namespace Domain.Commands.Rounds;

public class FinishRoundCommand : IFinishRoundCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IRoundsService roundsService;
    private readonly IGamesService gamesService;

    public FinishRoundCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService,
        IGamesService gamesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
        this.gamesService = gamesService;
    }

    public async Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id, List<MarkRoundRequest> marks)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<Round, InvalidRoundDataReason>>(
            async dbContext =>
            {
                var round = await roundsService.FindAsync(id);
                if (round == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not found");

                if (round.CurrentState!.State != RoundState.Mark)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't finish round not in mark state");

                if (marks.Count != 2)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't finish round with not 2 marks");

                if (marks[0].Mark == marks[1].Mark)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.SameMarks, "Can't finish round with equal marks");

                var winnerId = marks.MaxBy(x => x.Mark)!.TeamId;
                foreach (var mark in marks)
                    round = await roundsService.SetMark(round.Id, (mark.TeamId, mark.Mark, mark.TeamId == winnerId));

                await roundsService.AddHistoryItem(
                    round.Id,
                    new()
                    {
                        Value = new CompleteRoundHistoryItem()
                    });

                if (round.NextRoundId == null)
                {
                    var game = await gamesService.FindAsync(round.GameId);
                    if (game == null)
                        return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't finish round in not existing game");

                    await gamesService.PatchAsync(
                        game,
                        new JsonPatchDocument<Game>(
                            new List<Operation<Game>>()
                            {
                                new()
                                {
                                    op = "replace",
                                    path = "state",
                                    value = GameState.Complete
                                }
                            },
                            new DefaultContractResolver()));
                }
                else
                {
                    var nextRound = await roundsService.FindAsync(round.NextRoundId!.Value);
                    if (nextRound == null)
                        return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, $"Can't add participant in not existing round: {round.NextRoundId!.Value}");

                    await roundsService.PatchAsync(
                        nextRound,
                        new JsonPatchDocument<Round>(
                            new List<Operation<Round>>
                            {
                                new()
                                {
                                    op = "add",
                                    path = "participants/-",
                                    value = new Participant
                                    {
                                        TeamId = winnerId,
                                        Order = nextRound.Participants.Count,
                                        Points = 0,
                                        IsWinner = false,
                                        Challenges = new List<Guid>()
                                    }
                                }
                            },
                            new DefaultContractResolver()));
                }

                await dbContext.SaveChangesAsync();
                return round;
            });

        return result;
    }
}