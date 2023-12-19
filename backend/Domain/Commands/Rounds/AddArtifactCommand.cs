using Domain.Context;
using Domain.Services.Rounds;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models;
using Models.Rounds;
using Newtonsoft.Json.Serialization;

namespace Domain.Commands.Rounds;

public class AddArtifactCommand : IAddArtifactCommand
{
    private readonly IRoundsService roundsService;
    private readonly IDataContextAccessor dataContextAccessor;

    public AddArtifactCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
    }

    public async Task<DomainResult<Artifact, AccessSingleEntityError>> RunAsync(
        Guid roundId,
        ArtifactType artifactType,
        MemoryStream? fileStream,
        string? fileName,
        string? description)
    {
        var res = await dataContextAccessor.AccessDataAsync<DomainResult<Artifact, AccessSingleEntityError>>(
            async context =>
            {
                var round = await roundsService.FindAsync(roundId);
                if (round == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, "Round not found");

                if (artifactType == ArtifactType.Text && description == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.InvalidData, "Description is required, when artifact type is text");

                if (artifactType == ArtifactType.Image && fileStream == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.InvalidData, "File is required, when artifact type is image");

                var artifact = new Artifact
                {
                    Type = artifactType,
                    Title = description ?? fileName
                };

                switch (artifactType)
                {
                    case ArtifactType.Text:
                        artifact.Content = description!;
                        break;
                    case ArtifactType.Image:
                        var staticFolder = Path.Join(AppContext.BaseDirectory, "wwwroot");
                        var imagesFolder = Path.Join(staticFolder, "images");
                        var fileFolder = Path.Join(imagesFolder, $"{Guid.NewGuid()}{Path.GetExtension(fileName)}");

                        if (!Directory.Exists(imagesFolder))
                            Directory.CreateDirectory(imagesFolder);

                        await File.WriteAllBytesAsync(fileFolder, fileStream!.ToArray());

                        artifact.Content = fileFolder.Replace(staticFolder, string.Empty);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(artifactType), artifactType, null);
                }

                await roundsService.PatchAsync(
                    round,
                    new JsonPatchDocument<Round>(
                        new List<Operation<Round>>()
                        {
                            new()
                            {
                                path = "artifacts/-",
                                op = "add",
                                value = artifact
                            }
                        },
                        new DefaultContractResolver()));

                await context.SaveChangesAsync();

                return artifact;
            });

        return res;
    }
}