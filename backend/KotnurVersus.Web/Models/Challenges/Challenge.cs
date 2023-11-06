using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Challenges;

public class Challenge : EntityInfo, IEntity
{
    [Column("title")]
    public string Title { get; set; } = null!;
    [Column("description")]
    public string Description { get; set; } = null!;
    [Column("theme")]
    public string Theme { get; set; } = null!;
}