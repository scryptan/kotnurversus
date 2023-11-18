using Client.Challenges;
using Client.Games;

namespace Client;

public interface IApiClient
{
    IChallengeClient Challenges { get; }
    IGameClient Games { get; }
}