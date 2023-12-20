using Domain.Context;
using Domain.Helpers;
using Domain.Services.Games;
using Domain.Services.Rounds;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Challenges;
using Models.Rounds;
using Models.Search;

namespace Domain.Commands.Rounds;

public class GetAvailableChallengesCommand : IGetAvailableChallengesCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IRoundsService roundsService;
    private readonly IGamesService gamesService;

    public GetAvailableChallengesCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService,
        IGamesService gamesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
        this.gamesService = gamesService;
    }

    public async Task<DomainResult<SearchResult<SnapshotChallenge>, AccessMultipleEntitiesError>> RunAsync(Guid roundId, CancellationToken cancellationToken)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<SearchResult<SnapshotChallenge>, AccessMultipleEntitiesError>>(
            async dbContext =>
            {
                var round = await roundsService.FindAsync(roundId);
                if (round == null)
                    return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.NotFound, "Round not found");

                var game = (await gamesService.FindAsync(round.GameId))!;

                var withoutRepeat = game.Settings.WithoutChallengesRepeatInFinal;
                var challengesToExclude = new HashSet<Guid>();

                if (withoutRepeat && round.NextRoundId == null)
                {
                    var previousRounds = await roundsService.SearchAsync(
                        new RoundSearchRequest
                        {
                            NextRoundId = round.Id
                        },
                        cancellationToken);

                    challengesToExclude = previousRounds.Items
                        .SelectMany(x => x.Participants)
                        .SelectMany(x => x.Challenges)
                        .ToHashSet();
                }

                var challenges = await dbContext.SnapshotChallenges
                    .Where(
                        x => !challengesToExclude.Contains(x.Id)
                             && x.GameId == game.Id 
                             && x.RoundId == round.Id)
                    .Select(x => x.ToApiModel())
                    .ToArrayAsync(cancellationToken: cancellationToken);

                return new SearchResult<SnapshotChallenge>(challenges);
            });

        return result;
    }
}