using Models;

namespace Domain.Services.Base;

public interface IEntityService<T>
    where T : EntityInfo, IEntity
{
    Task<T?> FindAsync(Guid id);
    Task DeleteAsync(T entity);
}

public interface IEntityService<T, TInvalidDataReason> : IEntityService<T>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    Task WriteAsync(T entity, IWriteContext<T, TInvalidDataReason> writeContext);
}