namespace Models.Authorization;

public class UserRegisterRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}