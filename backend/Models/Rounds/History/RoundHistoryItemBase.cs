namespace Models.Rounds.History;

public class RoundHistoryItemBase
{
    public virtual RoundState CurrentState { get; set; } = RoundState.None;
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? End { get; set; }
    public Guid? TeamId { get; set; }
}