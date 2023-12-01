using Models.Specifications;

namespace Models.Rounds;

public class RoundCreationArgs : EntityCreationArgs
{
    public Guid GameId { get; set; }
    public Guid? NextRoundId { get; set; }
    public List<Participant>? Participants { get; set; }
    public Specification Specification { get; set; } = null!;
    public Settings.Settings? Settings { get; set; }
    public int Order { get; set; }
}