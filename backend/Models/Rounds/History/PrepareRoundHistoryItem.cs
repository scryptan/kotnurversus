namespace Models.Rounds.History;

public class PrepareRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState => RoundState.Prepare;
}