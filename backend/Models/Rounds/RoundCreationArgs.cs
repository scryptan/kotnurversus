namespace Models.Rounds;

public class RoundCreationArgs : EntityCreationArgs
{
    public Guid GameId { get; set; }
    public Guid? NextRoundId { get; set; }
    public int Order { get; set; }
}