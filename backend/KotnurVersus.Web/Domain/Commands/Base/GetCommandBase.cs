using Domain.Context;
using Domain.Helpers;
using Domain.Services.Base;
using Models;

namespace Domain.Commands.Base;

public abstract class GetCommandBase<T, TInvalidDataReason> : GetCommandBase<T, T, TInvalidDataReason>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    protected GetCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T, TInvalidDataReason> repository)
        : base(dataContextAccessor, repository)
    {
    }
}

public abstract class GetCommandBase<TEx, T, TInvalidDataReason> : IGetCommand<T>
    where TEx : T
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<TEx, TInvalidDataReason> repository;

    protected GetCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<TEx, TInvalidDataReason> repository)
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

                return typeof(T) == typeof(TEx)
                    ? existing
                    : existing.CopyEntity<T>(shallow: true);
            });
    }
}