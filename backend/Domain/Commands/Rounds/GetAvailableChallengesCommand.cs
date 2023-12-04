using Domain.Context;
using Domain.Services.Challenges;
using Domain.Services.Games;
using Domain.Services.Rounds;
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
    private readonly IChallengesService challengesService;

    public GetAvailableChallengesCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService,
        IGamesService gamesService,
        IChallengesService challengesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
        this.gamesService = gamesService;
        this.challengesService = challengesService;
    }

    public async Task<DomainResult<SearchResult<Challenge>, AccessMultipleEntitiesError>> RunAsync(Guid roundId, CancellationToken cancellationToken)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<SearchResult<Challenge>, AccessMultipleEntitiesError>>(
            async _ =>
            {
                var round = await roundsService.FindAsync(roundId);
                if (round == null)
                    return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.NotFound, "Round not found");

                var game = (await gamesService.FindAsync(round.GameId))!;

                var withoutRepeat = game.Settings.WithoutChallengesRepeatInFinal;
                HashSet<Guid>? challengesToExclude = null;
                
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

                var challenges = await challengesService.SearchAsync(
                    new ChallengeSearchRequest
                    {
                        ExcludeIds = challengesToExclude
                    },
                    cancellationToken);

                return challenges;
            });

        return result;
    }
}