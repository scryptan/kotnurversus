namespace Models.Challenges;

public class SnapshotChallenge : Challenge
{
    public Guid GameId { get; set; }
    public Guid RoundId { get; set; }
    public int Order { get; set; }
}