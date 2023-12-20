using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Challenges;

[Table("challenges")]
public class ChallengeDbo : Dbo
{
    [Column("title")]
    public string Title { get; set; } = null!;
    
    [Column("short_description")]
    public string? ShortDescription { get; set; }
    
    [Column("description")]
    public string Description { get; set; } = null!;
    
    [Column("categoryId")]
    public Guid CategoryId { get; set; }
    
    [Column("is_cat_in_bag")]
    public bool IsCatInBag { get; set; }
}