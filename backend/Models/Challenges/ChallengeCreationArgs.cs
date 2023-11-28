namespace Models.Challenges;

public class ChallengeCreationArgs : EntityCreationArgs
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public bool IsCatInBag { get; set; }
}