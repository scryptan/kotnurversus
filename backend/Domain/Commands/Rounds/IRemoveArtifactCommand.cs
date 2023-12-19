using Models;

namespace Domain.Commands.Rounds;

public interface IRemoveArtifactCommand
{
    Task<VoidDomainResult<AccessSingleEntityError>> RunAsync(
        Guid roundId,
        Guid artifactId);
}