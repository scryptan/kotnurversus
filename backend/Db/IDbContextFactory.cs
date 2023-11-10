namespace Db;

public interface IDbContextFactory
{
    DbContext CreateDbContext();
}