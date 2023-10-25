using Db.Dbo.Users;
using Microsoft.EntityFrameworkCore;

namespace Db;

public class DbContext : Microsoft.EntityFrameworkCore.DbContext
{
    private readonly IDbSettings settings;

    public DbContext(IDbSettings settings)
    {
        this.settings = settings;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.UseNpgsql(settings.ConnectionString, o => o.EnableRetryOnFailure(settings.MaxRetryOnFailureCount));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var workspace = modelBuilder.Entity<UserDbo>();
        workspace.HasKey(x => x.Id);
        workspace.HasIndex(x => x.Email).IsUnique();
    }
}