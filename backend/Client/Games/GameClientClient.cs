using Client.Base;
using Models.Games;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Games;

internal class GameClientClient : EntityClientBase<Game, GameCreationArgs, InvalidGameDataReason>, IGameClient
{
    public GameClientClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}