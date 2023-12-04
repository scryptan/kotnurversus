namespace Models.Rounds.History;

public class MarkRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState { get; set; } =  RoundState.Mark;
}