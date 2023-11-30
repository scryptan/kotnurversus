namespace Models.Rounds.History;

public class DefenseRoundHistoryItem : RoundHistoryItemBase
{
    public override RoundState CurrentState { get; set; } =  RoundState.Defense;
    public Guid TeamId { get; set; }
}