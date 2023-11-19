using Client.Base;
using Models.Games;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Games;

internal class Game : EntityClientBase<Models.Games.Game, GameCreationArgs, InvalidGameDataReason>, IGame
{
    public Game(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}