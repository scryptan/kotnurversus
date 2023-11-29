namespace Models.Rounds.History;

public class PauseRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState => RoundState.Pause;
    public Guid TeamId { get; set; }
}