using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class DeleteGameCommand : DeleteCommandBase<Game>
{
    public DeleteGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game> repository)
        : base(dataContextAccessor, repository)
    {
    }
}