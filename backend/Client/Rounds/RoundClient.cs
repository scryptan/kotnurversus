using Client.Base;
using Models.Rounds;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Rounds;

internal class RoundClient : EntityClientBase<Round, RoundCreationArgs, InvalidRoundDataReason>, IRoundClient
{
    public RoundClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}