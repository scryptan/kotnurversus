using Client.Base;
using Models.Games;

namespace Client.Games;

public interface IGame : IClientBase<Models.Games.Game, GameCreationArgs, InvalidGameDataReason>
{
}