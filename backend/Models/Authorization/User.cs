namespace Models.Authorization;

public class User
{
    public string Email { get; set; } = null!;
    public bool IsAuthorized { get; set; }
}