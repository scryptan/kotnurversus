using Client.Base;
using Models.Challenges;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Challenges;

internal class Challenge : EntityClientBase<Models.Challenges.Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>, IChallenge
{
    public Challenge(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}