using Microsoft.AspNetCore.JsonPatch;
using Models;
using Models.Search;

namespace Domain.Services.Base;

public interface IEntityService<T>
    where T : EntityInfo, IEntity
{
    Task<T?> FindAsync(Guid id);
    Task AddAsync(T entity);
    Task PatchAsync(T entity, JsonPatchDocument<T> patchDocument);
    Task DeleteAsync(T entity);
}

public interface IEntityService<T, in TSearchRequest> : IEntityService<T>
    where T : EntityInfo, IEntity
    where TSearchRequest : SearchRequestBase, ISearchRequest
{
    Task<SearchResult<T>> SearchAsync(TSearchRequest searchRequest, CancellationToken cancellationToken);
}