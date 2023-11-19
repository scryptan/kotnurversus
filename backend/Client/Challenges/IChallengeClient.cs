using Client.Base;
using Models.Challenges;

namespace Client.Challenges;

public interface IChallengeClient : IClientBase<Models.Challenges.Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
}