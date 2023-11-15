using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class GetRoundCommand : GetCommandBase<Round, InvalidRoundDataReason>
{
    public GetRoundCommand(IDataContextAccessor dataContextAccessor, IEntityService<Round, InvalidRoundDataReason> repository)
        : base(dataContextAccessor, repository)
    {
    }
}