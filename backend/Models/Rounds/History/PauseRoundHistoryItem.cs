namespace Models.Rounds.History;

public class PauseRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState { get; set; } = RoundState.Pause;
}