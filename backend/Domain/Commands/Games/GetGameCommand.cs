using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class GetGameCommand : GetCommandBase<Game, InvalidGameDataReason>
{
    public GetGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game, InvalidGameDataReason> repository)
        : base(dataContextAccessor, repository)
    {
    }
}