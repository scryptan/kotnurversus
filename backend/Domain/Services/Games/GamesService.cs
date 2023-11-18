using Db.Dbo.Games;
using Domain.Context;
using Domain.Services.Base;
using Models.Games;

namespace Domain.Services.Games;

public class GamesService : EntityServiceBase<Game, GameDbo>
{
    public GamesService(IDataContext context)
        : base(context, x => x.Games)
    {
    }

    protected override Task FillDboAsync(GameDbo dbo, Game entity) => Task.CompletedTask;

    protected override Task FillEntityAsync(Game entity, GameDbo dbo) => Task.CompletedTask;
}