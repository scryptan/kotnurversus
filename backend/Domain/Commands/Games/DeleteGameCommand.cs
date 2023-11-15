using Domain.Commands.Base;
using Domain.Context;
using Domain.Repositories.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class DeleteGameCommand : DeleteCommandBase<Game>
{
    public DeleteGameCommand(IDataContextAccessor dataContextAccessor, IEntityRepository<Game> repository)
        : base(dataContextAccessor, repository)
    {
    }
}