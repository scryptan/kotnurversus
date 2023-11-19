using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class DeleteRoundCommand : DeleteCommandBase<Round>
{
    public DeleteRoundCommand(IDataContextAccessor dataContextAccessor, IEntityService<Round> repository)
        : base(dataContextAccessor, repository)
    {
    }
}