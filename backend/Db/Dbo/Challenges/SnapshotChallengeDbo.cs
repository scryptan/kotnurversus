using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Challenges;

[Table("challenges_snapshot")]
public class SnapshotChallengeDbo : Dbo
{
    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("categoryId")]
    public Guid CategoryId { get; set; }

    [Column("is_cat_in_bag")]
    public bool IsCatInBag { get; set; }

    [Column("game_id")]
    public Guid GameId { get; set; }

    [Column("round_id")]
    public Guid RoundId { get; set; }

    [Column("order")]
    public int Order { get; set; }
}