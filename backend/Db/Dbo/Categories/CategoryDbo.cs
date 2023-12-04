using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Categories;

[Table("categories")]
public class CategoryDbo : Dbo
{
    [Column("title")]
    public string Title { get; set; } = null!;
    
    [Column("color")]
    public string Color { get; set; } = null!;
}