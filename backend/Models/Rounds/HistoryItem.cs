namespace Models.Rounds;

public class HistoryItem
{
    public int Order { get; set; }
    public RoundState State { get; set; }
    public object Value { get; set; } = null!;
}