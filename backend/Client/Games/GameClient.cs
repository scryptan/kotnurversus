using Client.Base;
using Models.Games;
using Models.Rounds;
using Vostok.Clusterclient.Core;
using Vostok.Clusterclient.Core.Model;
using Vostok.Logging.Abstractions;

namespace Client.Games;

internal class GameClient : EntityClientBase<Game, GameCreationArgs, RoundSearchRequest, InvalidGameDataReason>, IGameClient
{
    public GameClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }

    public async Task<OperationResult<Game, InvalidGameDataReason>> StartGame(Guid id, List<RoundCreationArgs> roundsToCreate)
    {
        var request = Request
            .Post($"{Route}/{id}/start")
            .WithJsonContent(new {RoundsToCreate = roundsToCreate});

        var res = await SendRequestAsync<Game, InvalidGameDataReason>(request);
        return res;
    }
}