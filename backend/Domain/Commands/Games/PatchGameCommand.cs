using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class PatchGameCommand : PatchCommandBase<Game, InvalidGameDataReason>
{
    public PatchGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game> repository)
        : base(dataContextAccessor, repository)
    {
    }
}