using Models;
using Models.Challenges;

namespace Domain.Commands.Rounds;

public interface IGetAvailableChallengesCommand
{
    Task<DomainResult<List<SnapshotChallenge>, AccessMultipleEntitiesError>> RunAsync(Guid roundId, CancellationToken cancellationToken);
}