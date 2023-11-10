using Models.Rounds;
using Models.Specifications;
using Models.Teams;

namespace Models.Games;

public class Game : EntityInfo, IEntity
{
    public List<Team> Teams { get; set; } = new();
    public Settings.Settings Settings { get; set; } = null!;
    public List<Specification> Specifications { get; set; } = new();
    public List<Round> Rounds { get; set; } = new();
    public GameState State { get; set; }
}