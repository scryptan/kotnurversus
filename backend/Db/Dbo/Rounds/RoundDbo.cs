using System.ComponentModel.DataAnnotations.Schema;
using Models.Rounds;
using Models.Settings;
using Models.Specifications;

namespace Db.Dbo.Rounds;

[Table("rounds")]
public class RoundDbo : Dbo
{
    [Column("history", TypeName = "jsonb")]
    public List<HistoryItem> History { get; set; } = new();

    [Column("game_id")]
    public Guid GameId { get; set; }

    [Column("specification", TypeName = "jsonb")]
    public Specification? Specification { get; set; }

    [Column("settings", TypeName = "jsonb")]
    public Settings Settings { get; set; } = null!;

    [Column("participants", TypeName = "jsonb")]
    public List<Participant> Participants { get; set; } = new();

    [Column("next_round_id")]
    public Guid? NextRoundId { get; set; }

    [Column("order")]
    public int Order { get; set; } // Номер этапа турнира  (финал, полуфинал, четверть и т.д)

    [Column("artifacts", TypeName = "jsonb")]
    public List<Artifact> Artifacts { get; set; } = new();

    [Column("description")]
    public string? Description { get; set; }
}