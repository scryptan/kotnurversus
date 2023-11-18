using Client.Base;
using Models.Games;

namespace Client.Games;

public interface IGameClient : IBaseClient<Game, GameCreationArgs, InvalidGameDataReason>
{
}