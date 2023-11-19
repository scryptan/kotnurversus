using Microsoft.AspNetCore.JsonPatch;
using Models;

namespace Domain.Services.Base;

public interface IEntityService<T>
    where T : EntityInfo, IEntity
{
    Task<T?> FindAsync(Guid id);
    Task AddAsync(T entity);
    Task PatchAsync(T entity, JsonPatchDocument<T> patchDocument);
    Task DeleteAsync(T entity);
}