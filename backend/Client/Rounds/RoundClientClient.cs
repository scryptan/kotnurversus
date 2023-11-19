using Client.Base;
using Models.Rounds;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Rounds;

internal class RoundClientClient : EntityClientBase<Round, RoundCreationArgs, InvalidRoundDataReason>, IRoundClient
{
    public RoundClientClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}