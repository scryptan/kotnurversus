using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class GetRoundCommand : GetCommandBase<Round>
{
    public GetRoundCommand(IDataContextAccessor dataContextAccessor, IEntityService<Round> repository)
        : base(dataContextAccessor, repository)
    {
    }
}