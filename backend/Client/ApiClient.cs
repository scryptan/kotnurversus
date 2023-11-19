using Client.Challenges;
using Client.Games;
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
        Games = new GameClientClient(clusterClient, log, "games");
    }

    public IChallengeClient Challenges { get; }
    public IGameClient Games { get; }
}