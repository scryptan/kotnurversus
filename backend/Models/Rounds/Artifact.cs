namespace Models.Rounds;

public class Artifact
{
    public Guid Id { get; set; }
    public ArtifactType Type { get; set; }
    public string? Title { get; set; }
    public string Content { get; set; } = null!;
}