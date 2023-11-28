using Client.Categories;
using Client.Challenges;
using Client.Games;
using Client.Rounds;
using Vostok.Clusterclient.Core;
using Vostok.Clusterclient.Transport;
using Vostok.Logging.Abstractions;

namespace Client;

public class ApiClient : IApiClient
{
    public ApiClient(Uri uri, ILog log)
        : this(
            s =>
            {
                s.SetupUniversalTransport();
                s.SetupExternalUrl(uri);
            },
            log)
    {
    }

    public ApiClient(ClusterClientSetup setup, ILog log)
    {
        var clusterClient = new ClusterClient(log.ForContext<ApiClient>(), setup);

        Challenges = new ChallengeClient(clusterClient, log, "challenges");
        Games = new GameClient(clusterClient, log, "games");
        Rounds = new RoundClient(clusterClient, log, "rounds");
        Categories = new CategoryClient(clusterClient, log, "categories");
    }

    public IChallengeClient Challenges { get; }
    public IGameClient Games { get; }
    public IRoundClient Rounds { get; }
    public ICategoryClient Categories { get; }
}