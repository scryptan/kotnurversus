namespace Models.Rounds.History;

public class CompleteRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState { get; set; } =  RoundState.Complete;
}