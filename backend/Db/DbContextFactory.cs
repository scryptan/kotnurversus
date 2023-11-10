namespace Db;

public class DbContextFactory: IDbContextFactory
{
    private readonly IDbSettings dbSettings;

    public DbContextFactory(IDbSettings dbSettings)
    {
        this.dbSettings = dbSettings;
    }

    public DbContext CreateDbContext() => new(dbSettings);
}