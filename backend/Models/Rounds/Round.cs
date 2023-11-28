using Models.Specifications;

namespace Models.Rounds;

public class Round : EntityInfo, IEntity
{
    public Settings.Settings Settings { get; set; } = null!;
    public Guid? WinnerId { get; set; }
    public Specification? Specification { get; set; }
    public List<Participant> Participants { get; set; } = new();
    public List<Artifact> Artifacts { get; set; } = new();
    public List<HistoryItem> History { get; set; } = new();
    public HistoryItem? CurrentState { get; set; }
    public Guid? NextRoundId { get; set; }
    public int Order { get; set; }
    public Guid GameId { get; set; }
}