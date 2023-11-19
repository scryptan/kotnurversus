using Client.Base;
using Models.Games;
using Models.Rounds;

namespace Client.Games;

public interface IGameClient : IClientBase<Game, GameCreationArgs, RoundSearchRequest, InvalidGameDataReason>
{
}