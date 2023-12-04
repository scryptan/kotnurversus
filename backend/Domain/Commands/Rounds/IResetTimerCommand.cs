using Models.Rounds;

namespace Domain.Commands.Rounds;

public interface IResetTimerCommand
{
    Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id, CancellationToken cancellationToken);
}