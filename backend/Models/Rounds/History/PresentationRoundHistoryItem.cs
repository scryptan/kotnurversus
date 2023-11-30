namespace Models.Rounds.History;

public class PresentationRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState { get; set; } = RoundState.Presentation;
    public Guid TeamId { get; set; }
}