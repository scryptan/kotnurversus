using Models.Specifications;
using Models.Teams;

namespace Models.Games;

public class Game : EntityInfo, IEntity
{
    public List<Team> Teams { get; set; } = new();
    public Settings.Settings Settings { get; set; } = null!;
    public List<Specification> Specifications { get; set; } = new();
    public GameState State { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public GameForm Form { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public bool CatsInTheBag { get; set; }
    public bool WithoutChallengesRepeatInFinal { get; set; }
}