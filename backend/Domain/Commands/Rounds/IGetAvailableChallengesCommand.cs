using Models;
using Models.Challenges;
using Models.Search;

namespace Domain.Commands.Rounds;

public interface IGetAvailableChallengesCommand
{
    Task<DomainResult<SearchResult<Challenge>, AccessMultipleEntitiesError>> RunAsync(Guid roundId, CancellationToken cancellationToken);
}