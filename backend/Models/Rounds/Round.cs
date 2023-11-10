using Models.Participants;
using Models.Specifications;

namespace Models.Rounds;

public class Round : EntityInfo, IEntity
{
    public Settings.Settings Settings { get; set; } = null!;
    public RoundState State { get; set; }
    public Guid? WinnerId { get; set; }
    public Specification? Specification { get; set; } // TODO: уточнить у Захара, когда готовятся бизнес требования
    public List<Participant> Participants { get; set; } = new(); // TODO: Стоит ли разделить это поле на 2 разных?
    public Guid? NextRoundId { get; set; }
}