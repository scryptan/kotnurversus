using Client.Base;
using Models.Challenges;

namespace Client.Challenges;

public interface IChallengeClient : IBaseClient<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
}