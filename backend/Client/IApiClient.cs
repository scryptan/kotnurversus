using Client.Challenges;

namespace Client;

public interface IApiClient
{
    IChallengeClient Challenges { get; }
}