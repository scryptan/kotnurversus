using Models.Rounds;

namespace Domain.Commands.Rounds;

public interface IStartRoundCommand
{
    Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id);
}