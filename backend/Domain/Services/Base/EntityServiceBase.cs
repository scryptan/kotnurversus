using Domain.Context;
using Domain.Helpers;
using Domain.Repositories.Base;
using Models;

namespace Domain.Services.Base;

public abstract class EntityServiceBase<T, TInvalidDataReason> : IEntityService<T, TInvalidDataReason>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IEntityRepository<T> storage;

    protected EntityServiceBase(
        IDataContext context,
        IEntityRepository<T> storage)
    {
        Context = context;
        this.storage = storage;
    }

    protected IDataContext Context { get; }

    public async Task<T?> FindAsync(Guid id)
    {
        var entity = await storage.FindAsync(id);
        if (entity != null)
        {
            RemoveSensitiveData(entity);
        }

        return entity;
    }

    public async Task DeleteAsync(T entity)
    {
        await storage.DeleteAsync(entity);
        await AfterDeleteAsync(entity);
    }

    public async Task WriteAsync(T entity, IWriteContext<T, TInvalidDataReason> writeContext)
    {
        var old = await storage.FindAsync(entity.Id);
        await PreprocessAsync(old, entity, writeContext);

        if (old != null)
        {
            if (EntityComparer.EntityEquals(old, entity, typeof(T)))
            {
                RemoveSensitiveData(entity);
                return;
            }
        }

        if (writeContext.IsSuccess)
        {
            await storage.WriteAsync(entity, isRestore: false);
        }

        RemoveSensitiveData(entity);
    }

    protected virtual void RemoveSensitiveData(T entity)
    {
    }

    protected virtual Task AfterDeleteAsync(T entity) => Task.CompletedTask;

    protected virtual Task PreprocessAsync(T? old, T entity, IWriteContext<T, TInvalidDataReason> writeContext) => Task.CompletedTask;
}