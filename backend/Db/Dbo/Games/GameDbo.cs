using System.ComponentModel.DataAnnotations.Schema;
using Models.Games;
using Models.Settings;
using Models.Specifications;
using Models.Teams;

namespace Db.Dbo.Games;

[Table("games")]
public class GameDbo : Dbo
{
    [Column("teams", TypeName = "jsonb")]
    public List<Team> Teams { get; set; } = new();

    [Column("settings", TypeName = "jsonb")]
    public Settings Settings { get; set; } = null!;

    [Column("specifications", TypeName = "jsonb")]
    public List<Specification> Specifications { get; set; } = new();

    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("start_date")]
    public DateTimeOffset StartDate { get; set; }

    [Column("form")]
    public GameForm Form { get; set; }

    [Column("state")]
    public GameState State { get; set; }
}