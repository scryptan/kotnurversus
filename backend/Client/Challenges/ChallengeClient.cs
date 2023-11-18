using Client.Base;
using Models.Challenges;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Challenges;

internal class ChallengeClient : BaseEntityClient<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>, IChallengeClient
{
    public ChallengeClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}