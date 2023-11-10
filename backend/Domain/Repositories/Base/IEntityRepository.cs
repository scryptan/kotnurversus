namespace Domain.Repositories.Base;

public interface IEntityRepository<T>
{
    Task<T?> FindAsync(Guid id);
    Task WriteAsync(T entity, bool isRestore);
    Task DeleteAsync(T entity);
}