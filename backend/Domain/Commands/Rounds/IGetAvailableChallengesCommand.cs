using Models;
using Models.Challenges;
using Models.Search;

namespace Domain.Commands.Rounds;

public interface IGetAvailableChallengesCommand
{
    Task<DomainResult<SearchResult<SnapshotChallenge>, AccessMultipleEntitiesError>> RunAsync(Guid roundId, CancellationToken cancellationToken);
}