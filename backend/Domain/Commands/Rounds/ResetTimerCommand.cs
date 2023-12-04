using Domain.Context;
using Domain.Services.Rounds;
using Models;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class ResetTimerCommand : IResetTimerCommand
{
    private readonly IRoundsService roundsService;
    private readonly IDataContextAccessor dataContextAccessor;

    public ResetTimerCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
    }

    public async Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id, CancellationToken cancellationToken)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<Round, InvalidRoundDataReason>>(
            async dbContext =>
            {
                var round = await roundsService.FindAsync(id);
                if (round == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not found");

                if (round.CurrentState == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't reset timer in not started round");

                if (round.CurrentState.Value.End != null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't reset timer in finished round");

                round.CurrentState.Value.Start = DateTimeOffset.Now;
                await roundsService.UpdateCurrentHistory(round);

                await dbContext.SaveChangesAsync(cancellationToken);
                return round;
            });

        return result;
    }
}