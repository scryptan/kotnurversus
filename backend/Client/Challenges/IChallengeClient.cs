using Client.Base;
using Models.Challenges;

namespace Client.Challenges;

public interface IChallengeClient : IClientBase<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
}