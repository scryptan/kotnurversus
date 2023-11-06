namespace Models.Challenges;

public class ChallengeCreationArgs: EntityCreationArgs
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Theme { get; set; } = null!;
}