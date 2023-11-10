using Core.Helpers;
using Db.Dbo;
using Domain.Context;
using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Models;
using DbContext = Db.DbContext;

namespace Domain.Repositories.Base;

public abstract class EntityRepositoryBase<T, TDbo> : IEntityRepository<T>
    where T : EntityInfo, IEntity, new()
    where TDbo : Dbo, new()
{
    private readonly Func<DbContext, DbSet<TDbo>> getMainDbSet;

    protected EntityRepositoryBase(Func<DbContext, DbSet<TDbo>> getMainDbSet, IDataContext context)
    {
        this.getMainDbSet = getMainDbSet;
        Context = context;
    }

    public async Task<T?> FindAsync(Guid id)
    {
        if (Context.Cache.TryGetValue(EntityCacheKey(id), out var cached))
            return ((Data?)cached)?.Entity.CopyEntity();

        var dbos = await ReadDboAsync(id);
        if (dbos == null)
        {
            Context.Cache[EntityCacheKey(id)] = null;
            return null;
        }

        var result = await ToApiAsync(dbos);

        Context.Cache[EntityCacheKey(id)] = new Data(result, dbos);
        return result.CopyEntity();
    }

    public async Task WriteAsync(T entity, bool isRestore)
    {
        if (!Context.Cache.TryGetValue(EntityCacheKey(entity.Id), out var cached))
            throw new InvalidOperationException();

        var data = (Data?)cached;
        var dbo = data?.Dbo;

        if (dbo == null)
        {
            dbo = new TDbo
            {
                Id = entity.Id
            };

            Context.DbContext.Add(dbo);
        }

        await FillDbosAsync(data?.Entity, entity, dbo);
        await FillEntityAsync(entity, dbo);

        var copyEntity = entity.CopyEntity();
        Context.Cache[EntityCacheKey(entity.Id)] = new Data(copyEntity, dbo);
        OnUpdateEntity(copyEntity);
    }

    public async Task DeleteAsync(T entity)
    {
        if (!Context.Cache.TryGetValue(EntityCacheKey(entity.Id), out var cached))
            throw new InvalidOperationException();

        var data = (Data?)cached;
        if (data == null)
            throw new InvalidOperationException();

        Context.DbContext.Remove(data.Dbo);

        Context.Cache[EntityCacheKey(entity.Id)] = null;
        OnDeleteEntity(entity);
    }

    protected async Task<T> ToApiAsync(TDbo dbos)
    {
        var result = new T
        {
            Id = dbos.Id,
        };

        await FillEntityAsync(result, dbos);
        return result;
    }

    protected abstract Task FillEntityAsync(T entity, TDbo dbo);

    protected abstract Task FillDbosAsync(T? old, T entity, TDbo dbo);

    protected IDataContext Context { get; }

    protected IQueryable<TDbo> QueryDbo(Guid id)
    {
        return getMainDbSet(Context.DbContext).Where(x => x.Id == id);
    }

    private async Task<TDbo?> ReadDboAsync(Guid id) => await QueryDbo(id).AsTracking().FirstOrDefaultAsync();

    private static string EntityCacheKey(Guid id) => $"{typeof(T).Name}{id}";

    private static readonly string updatedEntitiesCacheKey = $"{typeof(T).Name}_updated";
    private static readonly string deletedEntitiesCacheKey = $"{typeof(T).Name}_deleted";

    private void OnUpdateEntity(T entity)
    {
        Context.Cache.AddOrUpdate(
            updatedEntitiesCacheKey,
            _ => new List<T> {entity},
            (_, entities) =>
            {
                ((List<T>)entities!).Add(entity);
                return entities;
            });
    }

    private void OnDeleteEntity(T entity)
    {
        Context.Cache.AddOrUpdate(
            deletedEntitiesCacheKey,
            _ => new List<T> {entity},
            (_, entities) =>
            {
                ((List<T>)entities!).Add(entity);
                return entities;
            });

        Context.Cache.AddOrUpdate(
            updatedEntitiesCacheKey,
            _ => new List<T> {entity},
            (_, entities) =>
            {
                ((List<T>)entities!).RemoveAll(x => x.Id == entity.Id);
                return entities;
            });
    }

    protected class Data
    {
        public Data(T entity, TDbo dbo)
        {
            Entity = entity;
            Dbo = dbo;
        }

        public T Entity { get; }

        public TDbo Dbo { get; }
    }
}