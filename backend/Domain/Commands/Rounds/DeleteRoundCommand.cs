using Domain.Commands.Base;
using Domain.Context;
using Domain.Repositories.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class DeleteRoundCommand : DeleteCommandBase<Round>
{
    public DeleteRoundCommand(IDataContextAccessor dataContextAccessor, IEntityRepository<Round> repository)
        : base(dataContextAccessor, repository)
    {
    }
}