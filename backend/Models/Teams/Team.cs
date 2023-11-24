namespace Models.Teams;

public class Team
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public List<string> Mates { get; set; } = new();
    public int Order { get; set; }
}