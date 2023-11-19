using Client.Base;
using Models.Rounds;

namespace Client.Rounds;

public interface IRoundClient : IClientBase<Round, RoundCreationArgs, RoundSearchRequest, InvalidRoundDataReason>
{
}