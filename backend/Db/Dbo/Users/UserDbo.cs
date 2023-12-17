using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo.Users;

[Table("users")]
public class UserDbo : Dbo
{
    [Column("email")] 
    public string Email { get; set; } = null!;
    
    [Column("password_hash")] 
    public string PasswordHash { get; set; } = null!;

    [Column("is_authorized")]
    public bool IsAuthorized { get; set; } = false;
}