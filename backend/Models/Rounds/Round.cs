using Models.Specifications;

namespace Models.Rounds;

public class Round : EntityInfo, IEntity
{
    public Settings.Settings Settings { get; set; } = null!;
    public Guid? WinnerId => Participants.FirstOrDefault(x => x.IsWinner)?.TeamId;
    public Specification? Specification { get; set; }
    public List<Participant> Participants { get; set; } = new();
    public List<Artifact> Artifacts { get; set; } = new();
    public List<HistoryItem> History { get; set; } = new();
    public HistoryItem? CurrentState => History.MaxBy(x => x.Order);
    public Guid? NextRoundId { get; set; }
    public int Order { get; set; }
    public Guid GameId { get; set; }
    public string? Description { get; set; }
}