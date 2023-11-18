using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class CreateChallengeCommand : CreateCommandBase<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
    public CreateChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityService<Challenge> repository)
        : base(dataContextAccessor, repository)
    {
    }
}