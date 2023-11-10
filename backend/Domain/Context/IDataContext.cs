using Db;

namespace Domain.Context;

public interface IDataContext
{
    Dictionary<object, object?> Cache { get; }
    DateTimeOffset Now { get; }
    DbContext DbContext { get; }
}