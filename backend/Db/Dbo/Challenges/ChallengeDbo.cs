using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Challenges;

[Table("challenges")]
public class ChallengeDbo : Dbo
{
    
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Theme { get; set; } = null!;
}