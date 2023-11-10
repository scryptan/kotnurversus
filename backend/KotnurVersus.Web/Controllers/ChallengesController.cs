using KotnurVersus.Web.Controllers.Base;
using Models.Challenges;

namespace KotnurVersus.Web.Controllers;

public class ChallengesController : CreatableEntityControllerBase<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason, ChallengeSearchRequest>
{
}