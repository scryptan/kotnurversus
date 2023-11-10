using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Users;

[Table("users")]
public class UserDbo : Dbo
{
    [Column("email")] 
    public string Email { get; set; } = null!;
}