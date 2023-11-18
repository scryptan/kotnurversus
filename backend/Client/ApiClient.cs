using Client.Challenges;
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
    }

    public IChallengeClient Challenges { get; }
}