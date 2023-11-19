using Client.Base;
using Models.Games;

namespace Client.Games;

public interface IGameClient : IClientBase<Game, GameCreationArgs, InvalidGameDataReason>
{
}