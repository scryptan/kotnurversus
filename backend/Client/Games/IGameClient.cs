using Client.Base;
using Models.Games;
using Models.Rounds;

namespace Client.Games;

public interface IGameClient : IClientBase<Game, GameCreationArgs, RoundSearchRequest, InvalidGameDataReason>
{
    Task<OperationResult<Game, InvalidGameDataReason>> StartGame(Guid id, List<RoundCreationArgs> roundsToCreate);
}