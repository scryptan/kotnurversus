using Models.Search;

namespace Models.Challenges;

public class ChallengeSearchRequest : SearchRequestBase
{
    public Guid? CategoryId { get; set; }
    public HashSet<Guid>? ExcludeIds { get; set; }
}