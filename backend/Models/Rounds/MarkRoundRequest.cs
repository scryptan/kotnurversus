namespace Models.Rounds;

public class MarkRoundRequest
{
    public Guid TeamId { get; set; }
    public int Mark { get; set; }
}