using Domain.Commands.Base;
using Domain.Context;
using Domain.Repositories.Base;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class DeleteChallengeCommand : DeleteCommandBase<Challenge>
{
    public DeleteChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityRepository<Challenge> repository)
        : base(dataContextAccessor, repository)
    {
    }
}