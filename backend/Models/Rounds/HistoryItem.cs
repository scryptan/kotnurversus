namespace Models.Rounds;

public class HistoryItem
{
    public int Order { get; set; }
    public GameState State { get; set; }
    public object Value { get; set; } = null!;
}