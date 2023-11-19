using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class PatchRoundCommand : PatchCommandBase<Round, InvalidRoundDataReason>
{
    public PatchRoundCommand(IDataContextAccessor dataContextAccessor, IEntityService<Round> service)
        : base(dataContextAccessor, service)
    {
    }
}