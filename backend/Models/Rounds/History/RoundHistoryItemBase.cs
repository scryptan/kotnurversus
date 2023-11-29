namespace Models.Rounds.History;

public class RoundHistoryItemBase
{
    public virtual RoundState CurrentState { get; private set; } = RoundState.None;
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? End { get; set; }
}