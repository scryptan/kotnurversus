using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Services.Challenges;

public interface IChallengesService : IEntityService<Challenge, ChallengeSearchRequest>
{
    
}