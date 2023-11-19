using Client.Challenges;
using Client.Games;
using Client.Rounds;

namespace Client;

public interface IApiClient
{
    IChallengeClient Challenges { get; }
    IGameClient Games { get; }
    IRoundClient Rounds { get; }
}