namespace Models.Challenges;

public class Challenge : EntityInfo, IEntity
{
    public string Title { get; set; } = null!;
    public string? ShortDescription { get; set; }
    public string Description { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public bool IsCatInBag { get; set; }
}