using Db.Dbo.Games;
using Domain.Context;
using Domain.Services.Base;
using Microsoft.EntityFrameworkCore;
using Models.Games;

namespace Domain.Services.Games;

public class GamesService : EntityServiceBase<Game, GameDbo, GameSearchRequest>, IGamesService
{
    public GamesService(IDataContext context)
        : base(context, x => x.Games)
    {
    }

    protected override Task FillDboAsync(GameDbo dbo, Game entity)
    {
        dbo.Id = entity.Id;
        dbo.Title = entity.Title;
        dbo.Settings = entity.Settings;
        dbo.Description = entity.Description;
        dbo.Form = entity.Form;
        dbo.Teams = entity.Teams;
        dbo.StartDate = entity.StartDate;
        dbo.Specifications = entity.Specifications;
        dbo.State = entity.State;

        return Task.CompletedTask;
    }

    protected override Task FillEntityAsync(Game entity, GameDbo dbo)
    {
        entity.Id = dbo.Id;
        entity.Title = dbo.Title;
        entity.Settings = dbo.Settings;
        entity.Description = dbo.Description;
        entity.Form = dbo.Form;
        entity.Teams = dbo.Teams;
        entity.StartDate = dbo.StartDate;
        entity.Specifications = dbo.Specifications;
        entity.State = dbo.State;

        return Task.CompletedTask;
    }

    public async Task DeleteAllRounds(Guid gameId)
    {
        var rounds = await Context.DbContext.Rounds.Where(x => x.GameId == gameId).ToArrayAsync();
        Context.DbContext.Rounds.RemoveRange(rounds);
    }
}