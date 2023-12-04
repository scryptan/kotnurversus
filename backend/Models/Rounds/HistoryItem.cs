using Models.Rounds.History;

namespace Models.Rounds;

public class HistoryItem
{
    public int Order { get; set; }
    public RoundHistoryItemBase Value { get; set; } = null!;
    public RoundState State => Value.CurrentState;
}