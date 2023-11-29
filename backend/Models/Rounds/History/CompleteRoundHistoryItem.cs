namespace Models.Rounds.History;

public class CompleteRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState => RoundState.Complete;
}