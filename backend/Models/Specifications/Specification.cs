namespace Models.Specifications;

public class Specification
{
    public string Title { get; set; } = null!;
    public string BusinessDescription { get; set; } = null!;
    public string TechDescription { get; set; } = null!;
    public int Order { get; set; }
}