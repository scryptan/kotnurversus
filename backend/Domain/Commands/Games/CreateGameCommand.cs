using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Commands.Games;

public class CreateGameCommand : CreateCommandBase<Game, GameCreationArgs, InvalidGameDataReason>
{
    public CreateGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game, InvalidGameDataReason> repository)
        : base(dataContextAccessor, repository)
    {
    }
}