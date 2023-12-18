namespace Models.Authorization;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public bool IsAuthorized { get; set; }
}