using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;
using Models.Settings;
using Models.Specifications;

namespace Domain.Commands.Games;

public class CreateGameCommand : CreateCommandBase<Game, GameCreationArgs, InvalidGameDataReason>
{
    public CreateGameCommand(IDataContextAccessor dataContextAccessor, IEntityService<Game> repository)
        : base(dataContextAccessor, repository)
    {
    }

    protected override Game ConvertToEntity(GameCreationArgs args) => new()
    {
        Title = args.Title,
        Specifications = args.Specifications ?? new List<Specification>(),
        Settings = args.Settings ?? new Settings(),
        Description = args.Description,
        Form = args.Form,
        StartDate = args.StartDate,
        State = GameState.Prepare,
    };
}