namespace Models.Challenges;

public class Challenge : EntityInfo, IEntity
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Theme { get; set; } = null!;
}