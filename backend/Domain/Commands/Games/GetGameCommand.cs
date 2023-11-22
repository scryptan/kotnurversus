using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class GetGameCommand : GetCommandBase<Game>
{
    public GetGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game> service)
        : base(dataContextAccessor, service)
    {
    }
}