using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Games;

[Table("games")]
public class GameDbo : Dbo
{
    [Column("teams", TypeName = "jsonb")]
    public List<TeamDbo> Teams { get; set; } = new();

    [Column("settings", TypeName = "jsonb")]
    public SettingsDbo Settings { get; set; } = null!;

    [Column("specifications", TypeName = "jsonb")]
    public List<SpecificationDbo> Specifications { get; set; } = new();

    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("start_date")]
    public DateTimeOffset StartDate { get; set; }

    [Column("form")]
    public GameForm Form { get; set; }
}