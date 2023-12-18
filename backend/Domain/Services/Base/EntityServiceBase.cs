using Core.Helpers;
using Db.Dbo;
using Domain.Context;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Search;
using DbContext = Db.DbContext;

namespace Domain.Services.Base;

public abstract class EntityServiceBase<T, TDbo, TSearchRequest> : IEntityService<T, TSearchRequest>
    where T : EntityInfo, IEntity, new()
    where TDbo : Dbo, new()
    where TSearchRequest : SearchRequestBase, ISearchRequest
{
    private readonly Func<DbContext, DbSet<TDbo>> getMainDbSet;
    protected const int MaxLimit = 100;

    protected EntityServiceBase(
        IDataContext context,
        Func<DbContext, DbSet<TDbo>> getMainDbSet)
    {
        Context = context;
        this.getMainDbSet = getMainDbSet;
    }

    protected IDataContext Context { get; }
    private string EntityCacheKey(Guid id) => $"{typeof(T)}_{id}";

    public async Task<T?> FindAsync(Guid id)
    {
        if (Context.Cache.TryGetValue(EntityCacheKey(id), out var res))
            return ((Data)res!).Entity;

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
        Context.Cache.AddOrUpdate(
            EntityCacheKey(entity.Id),
            new Data {Dbo = dbo, Entity = entity},
            (_, value) =>
            {
                var data = (Data)value!;
                data.Dbo = dbo;
                data.Entity = entity;
                return data;
            });
    }

    public async Task PatchAsync(T entity, JsonPatchDocument<T> patchDocument)
    {
        var dbo = await ReadDboAsync(entity.Id);
        if (dbo == null)
            throw new ArgumentException("Entity not exists");

        patchDocument.ApplyTo(entity);
        await FillDboAsync(dbo, entity);

        getMainDbSet(Context.DbContext).Update(dbo);
        Context.Cache.AddOrUpdate(
            EntityCacheKey(entity.Id),
            new Data {Dbo = dbo, Entity = entity},
            (_, value) =>
            {
                var data = (Data)value!;
                data.Dbo = dbo;
                data.Entity = entity;
                return data;
            });
    }

    public async Task DeleteAsync(T entity)
    {
        var dbo = await ReadDboAsync(entity.Id);
        if (dbo == null)
            throw new ArgumentException("Entity not exists");

        getMainDbSet(Context.DbContext).Remove(dbo);
        await AfterDeleteAsync(entity);
        Context.Cache.Remove(EntityCacheKey(entity.Id));
    }

    public async Task<SearchResult<T>> SearchAsync(TSearchRequest searchRequest, CancellationToken cancellationToken)
    {
        var queryable = ReadDbosAsync();
        queryable = await ApplyFilterAsync(queryable, searchRequest);

        var dbos = await queryable
            .AsEnumerable()
            .Select(async x => await ToApiAsync(x))
            .ToArrayAsync();

        var result = new SearchResult<T>(dbos);

        return result;
    }

    protected virtual Task<IQueryable<TDbo>> ApplyFilterAsync(IQueryable<TDbo> queryable, TSearchRequest searchRequest)
    {
        if (searchRequest.Limit != null)
            queryable = queryable.Take(searchRequest.Limit.Value);

        return Task.FromResult(queryable);
    }

    protected async Task<T> ToApiAsync(TDbo dbos)
    {
        var result = new T();

        await FillEntityAsync(result, dbos);
        await RemoveSensitiveDataAsync(result);
        return result;
    }

    protected virtual Task AfterDeleteAsync(T entity) => Task.CompletedTask;
    protected abstract Task FillDboAsync(TDbo dbo, T entity);
    protected abstract Task FillEntityAsync(T entity, TDbo dbo);
    protected virtual Task PreprocessAsync(T? entity) => Task.CompletedTask;
    protected virtual Task RemoveSensitiveDataAsync(T? entity) => Task.CompletedTask;

    protected bool IsUserAuthorized()
    {
        var authorizedUser = Context.User?.Claims.FirstOrDefault(x => x.Type == CustomClaim.IsAuthorized)?.Value;
        return authorizedUser != null && bool.TryParse(authorizedUser, out var isAuthorized) && isAuthorized;
    }

    private async Task<TDbo?> ReadDboAsync(Guid id) =>
        await getMainDbSet(Context.DbContext).Where(x => x.Id == id).AsTracking().FirstOrDefaultAsync();

    private IQueryable<TDbo> ReadDbosAsync() =>
        getMainDbSet(Context.DbContext).AsQueryable();

    private class Data
    {
        public TDbo Dbo { get; set; } = null!;
        public T Entity { get; set; } = null!;
    }
}