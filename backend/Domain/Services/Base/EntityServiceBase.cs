using System.ComponentModel.Design;
using Db.Dbo;
using Domain.Context;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Models;
using DbContext = Db.DbContext;

namespace Domain.Services.Base;

public abstract class EntityServiceBase<T, TDbo> : IEntityService<T>
    where T : EntityInfo, IEntity, new()
    where TDbo : Dbo, new()
{
    private readonly Func<DbContext, DbSet<TDbo>> getMainDbSet;

    protected EntityServiceBase(
        IDataContext context,
        Func<DbContext, DbSet<TDbo>> getMainDbSet)
    {
        Context = context;
        this.getMainDbSet = getMainDbSet;
    }

    protected IDataContext Context { get; }

    public async Task<T?> FindAsync(Guid id)
    {
        var dbos = await ReadDboAsync(id);
        if (dbos == null)
        {
            return null;
        }

        var result = new T();
        await FillEntityAsync(result, dbos);

        return result;
    }

    public async Task AddAsync(T entity)
    {
        await PreprocessAsync(entity);

        var dbo = new TDbo();
        await FillDboAsync(dbo, entity);

        await getMainDbSet(Context.DbContext).AddAsync(dbo);
    }

    public async Task PatchAsync(T entity, JsonPatchDocument<T> patchDocument)
    {
        var dbo = await ReadDboAsync(entity.Id);
        if (dbo == null)
            throw new ArgumentException("Entity not exists");

        patchDocument.ApplyTo(entity);
        await FillDboAsync(dbo, entity);
    }

    public async Task DeleteAsync(T entity)
    {
        var dbo = await ReadDboAsync(entity.Id);
        if (dbo == null)
            throw new ArgumentException("Entity not exists");

        getMainDbSet(Context.DbContext).Remove(dbo);
        await AfterDeleteAsync(entity);
    }

    protected virtual Task AfterDeleteAsync(T entity) => Task.CompletedTask;
    protected abstract Task FillDboAsync(TDbo dbo, T entity);
    protected abstract Task FillEntityAsync(T entity, TDbo dbo);
    protected virtual Task PreprocessAsync(T? entity) => Task.CompletedTask;

    private async Task<TDbo?> ReadDboAsync(Guid id) =>
        await getMainDbSet(Context.DbContext).Where(x => x.Id == id).AsTracking().FirstOrDefaultAsync();
}