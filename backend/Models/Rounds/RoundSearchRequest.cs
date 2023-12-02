using Models.Search;

namespace Models.Rounds;

public class RoundSearchRequest : SearchRequestBase
{
    public Guid? GameId { get; set; }
    public Guid? NextRoundId { get; set; }
}