using Client.Challenges;
using Client.Games;

namespace Client;

public interface IApiClient
{
    IChallenge Challenges { get; }
    IGame Games { get; }
}