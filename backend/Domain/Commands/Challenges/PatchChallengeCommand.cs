using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class PatchChallengeCommand : PatchCommandBase<Challenge, InvalidChallengeDataReason>
{
    public PatchChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityService<Challenge> repository)
        : base(dataContextAccessor, repository)
    {
    }
}