using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Rounds;

[Table("rounds")]
public class RoundDbo : Dbo
{
    [Column("history", TypeName = "jsonb")]
    public List<HistoryItemDbo> History { get; set; } = new();
    
    [Column("game_id")]
    public Guid GameId { get; set; }
    
    [Column("specification")]
    public SpecificationDbo? Specification { get; set; }

    [Column("participants", TypeName = "jsonb")]
    public List<ParticipantDbo> Participants { get; set; } = new();
    
    [Column("next_round_id")]
    public Guid? NextRoundId { get; set; }

    [Column("order")]
    public int Order { get; set; } // Номер этапа турнира  (финал, полуфинал, четверть и т.д)

    [Column("artifacts", TypeName = "jsonb")]
    public List<ArtifactDbo> Artifacts { get; set; } = new();
}