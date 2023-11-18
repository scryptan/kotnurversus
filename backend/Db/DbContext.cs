using Db.Dbo.Challenges;
using Db.Dbo.Games;
using Db.Dbo.Rounds;
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

    public DbSet<RoundDbo> Rounds { get; set; } = null!;
    public DbSet<GameDbo> Games { get; set; } = null!;
    public DbSet<ChallengeDbo> Challenge { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.UseNpgsql(settings.ConnectionString, o => o.EnableRetryOnFailure(settings.MaxRetryOnFailureCount));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var user = modelBuilder.Entity<UserDbo>();
        user.HasKey(x => x.Id);
        user.HasIndex(x => x.Email).IsUnique();

        var challenge = modelBuilder.Entity<ChallengeDbo>();
        challenge.HasKey(x => x.Id);
        challenge.HasIndex(x => new {x.Title, x.Theme}).IsUnique();
    }
}