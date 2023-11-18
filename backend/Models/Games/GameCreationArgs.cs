using Models.Specifications;

namespace Models.Games;

public class GameCreationArgs : EntityCreationArgs
{
    public Settings.Settings? Settings { get; set; }
    public List<Specification>? Specifications { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public GameForm Form { get; set; }
    public DateTimeOffset StartDate { get; set; }
}