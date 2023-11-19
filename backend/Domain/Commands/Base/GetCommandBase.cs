using Domain.Context;
using Domain.Services.Base;
using Models;

namespace Domain.Commands.Base;

public abstract class GetCommandBase<T, TInvalidDataReason> : IGetCommand<T>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<T> repository;

    protected GetCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T> repository)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.repository = repository;
    }

    public Task<DomainResult<T, AccessSingleEntityError>> RunAsync(Guid id)
    {
        return dataContextAccessor.AccessDataAsync<DomainResult<T, AccessSingleEntityError>>(
            async _ =>
            {
                var existing = await repository.FindAsync(id);
                if (existing == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, $"{typeof(T).Name} {id} not found");

                return existing;
            });
    }
}