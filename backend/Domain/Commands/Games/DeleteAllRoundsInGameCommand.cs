using Domain.Context;
using Domain.Services.Games;
using Models;

namespace Domain.Commands.Games;

public class DeleteAllRoundsInGameCommand : IDeleteAllRoundsInGameCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IGamesService service;

    public DeleteAllRoundsInGameCommand(
        IDataContextAccessor dataContextAccessor,
        IGamesService service)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.service = service;
    }

    public async Task<VoidDomainResult<AccessMultipleEntitiesError>> RunAsync(Guid id)
    {
        var result = await dataContextAccessor.AccessDataAsync<VoidDomainResult<AccessMultipleEntitiesError>>(
            async dbContext =>
            {
                var existing = await service.FindAsync(id);
                if (existing == null)
                    return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.NotFound, "Game not found");

                await service.DeleteAllRounds(id);
                await dbContext.SaveChangesAsync();
                return VoidDomainResult.Success;
            });

        return result;
    }
}