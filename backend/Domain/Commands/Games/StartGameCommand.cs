using Domain.Services.Games;
using Domain.Services.Rounds;
using Models.Games;
using Models.Rounds;

namespace Domain.Commands.Games;

public class StartGameCommand : IStartGameCommand
{
    private IGamesService gamesService;
    private IRoundsService roundsService;

    public StartGameCommand(IGamesService gamesService, IRoundsService roundsService)
    {
        this.gamesService = gamesService;
        this.roundsService = roundsService;
    }

    public async Task<DomainResult<Game, InvalidGameDataReason>> RunAsync(Guid id, List<RoundCreationArgs> roundsToCreate)
    {
    }
}