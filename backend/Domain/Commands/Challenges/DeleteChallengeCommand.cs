using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class DeleteChallengeCommand : DeleteCommandBase<Challenge>
{
    public DeleteChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityService<Challenge> service)
        : base(dataContextAccessor, service)
    {
    }
}