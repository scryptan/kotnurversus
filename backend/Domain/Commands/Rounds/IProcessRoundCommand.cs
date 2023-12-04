using Models.Rounds;

namespace Domain.Commands.Rounds;

public interface IProcessRoundCommand
{
    Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid roundId, RoundState state, Guid? teamId, bool isStartAction );
}