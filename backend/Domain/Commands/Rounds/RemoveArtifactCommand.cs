using Domain.Context;
using Domain.Services.Rounds;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models;
using Models.Rounds;
using Newtonsoft.Json.Serialization;

namespace Domain.Commands.Rounds;

public class RemoveArtifactCommand : IRemoveArtifactCommand
{
    private readonly IRoundsService roundsService;
    private readonly IDataContextAccessor dataContextAccessor;

    public RemoveArtifactCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
    }

    public async Task<VoidDomainResult<AccessSingleEntityError>> RunAsync(
        Guid roundId,
        Guid artifactId)
    {
        var res = await dataContextAccessor.AccessDataAsync<VoidDomainResult<AccessSingleEntityError>>(
            async context =>
            {
                var round = await roundsService.FindAsync(roundId);
                if (round == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, "Round not found");

                var artifact = round.Artifacts.FirstOrDefault(x => x.Id == artifactId);
                if (artifact == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, "Artifact not found");

                round.Artifacts.Remove(artifact);
                await roundsService.PatchAsync(
                    round,
                    new JsonPatchDocument<Round>(
                        new List<Operation<Round>>()
                        {
                            new()
                            {
                                path = "artifacts",
                                op = "replace",
                                value = round.Artifacts
                            }
                        },
                        new DefaultContractResolver()));

                await context.SaveChangesAsync();

                var staticFolder = Path.Join(AppContext.BaseDirectory, "wwwroot");
                var fileFolder = Path.Join(staticFolder, artifact.Content);
                File.Delete(fileFolder);

                return VoidDomainResult.Success;
            });

        return res;
    }
}