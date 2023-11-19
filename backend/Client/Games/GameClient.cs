using Client.Base;
using Models.Games;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Games;

internal class GameClient : EntityClientBase<Game, GameCreationArgs, InvalidGameDataReason>, IGameClient
{
    public GameClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}