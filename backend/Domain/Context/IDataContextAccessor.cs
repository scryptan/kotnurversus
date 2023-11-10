using Db;

namespace Domain.Context;

public interface IDataContextAccessor
{
    Task<T> AccessDataAsync<T>(Func<DbContext, Task<T>> writeDataAsync, string[]? concurrentConstrains = null);
}