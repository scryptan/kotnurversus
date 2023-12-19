using Models;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public interface IAddArtifactCommand
{
    Task<DomainResult<Artifact, AccessSingleEntityError>> RunAsync(
        Guid roundId,
        ArtifactType artifactType,
        MemoryStream? fileStream,
        string? fileName,
        string? description);
}