using Models.Rounds.History;

namespace Models.Rounds;

public class HistoryItem
{
    public int Order { get; set; }
    public RoundState State { get; set; }
    public RoundHistoryItemBase Value { get; set; } = null!;
}