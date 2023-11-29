using Models.Rounds;

namespace Domain.Commands.Rounds;

public interface IFinishRoundCommand
{
    Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id, List<MarkRoundRequest> marks);
}