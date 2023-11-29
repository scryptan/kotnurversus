using Models.Specifications;

namespace Models.Rounds;

public class RoundCreationArgs : EntityCreationArgs
{
    public Guid GameId { get; set; }
    public Guid? NextRoundId { get; set; }
    public List<Participant>? Participants { get; set; }
    public Specification Specification { get; set; } = null!;
    public int Order { get; set; }
}