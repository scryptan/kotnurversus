using Models.Games;
using Models.Rounds;

namespace Domain.Commands.Games;

public interface IStartGameCommand
{
    Task<DomainResult<Game, InvalidGameDataReason>> RunAsync(Guid id, List<RoundCreationArgs> roundsToCreate);
}