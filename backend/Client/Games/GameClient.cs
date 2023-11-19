using Client.Base;
using Models.Games;
using Models.Rounds;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Games;

internal class GameClient : EntityClientBase<Game, GameCreationArgs, RoundSearchRequest, InvalidGameDataReason>, IGameClient
{
    public GameClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}