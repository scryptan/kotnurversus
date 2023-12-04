using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class SearchGameCommand : SearchCommandBase<Game, GameSearchRequest>
{
    public SearchGameCommand(IEntityService<Game, GameSearchRequest> service, IDataContextAccessor dataContextAccessor)
        : base(service, dataContextAccessor)
    {
    }
}