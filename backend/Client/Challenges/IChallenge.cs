using Client.Base;
using Models.Challenges;

namespace Client.Challenges;

public interface IChallenge : IClientBase<Models.Challenges.Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
}