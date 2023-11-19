namespace Models.Rounds;

public class Participant
{
    public int Order { get; set; }
    public Guid TeamId { get; set; }
    public List<Guid> Challenges { get; set; } = new();
    public bool IsWinner { get; set; }
    public int Points { get; set; }
}