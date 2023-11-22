using Domain.Context;
using Domain.Services.Base;
using Models;

namespace Domain.Commands.Base;

public abstract class GetCommandBase<T> : IGetCommand<T>
    where T : EntityInfo, IEntity
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<T> service;

    protected GetCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T> service)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.service = service;
    }

    public Task<DomainResult<T, AccessSingleEntityError>> RunAsync(Guid id)
    {
        return dataContextAccessor.AccessDataAsync<DomainResult<T, AccessSingleEntityError>>(
            async _ =>
            {
                var existing = await service.FindAsync(id);
                if (existing == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, $"{typeof(T).Name} {id} not found");

                return existing;
            });
    }
}