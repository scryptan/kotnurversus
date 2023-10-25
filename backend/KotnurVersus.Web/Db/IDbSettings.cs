namespace Db;

public interface IDbSettings
{
    public string ConnectionString { get; }
    public int MaxRetryOnFailureCount { get; }
}