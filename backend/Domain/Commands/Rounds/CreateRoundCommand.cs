using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class CreateRoundCommand : CreateCommandBase<Round, RoundCreationArgs, InvalidRoundDataReason>
{
    public CreateRoundCommand(IDataContextAccessor dataContextAccessor, IEntityService<Round> repository)
        : base(dataContextAccessor, repository)
    {
    }
}