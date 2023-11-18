using Db.Dbo.Challenges;
using Domain.Context;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Services.Challenges;

public class ChallengesService : EntityServiceBase<Challenge, ChallengeDbo>
{
    public ChallengesService(IDataContext context)
        : base(context, x => x.Challenge)
    {
    }

    protected override Task FillDboAsync(ChallengeDbo dbo, Challenge entity)
    {
        dbo.Description = entity.Description;
        dbo.Id = entity.Id;
        dbo.Theme = entity.Theme;
        dbo.Title = entity.Title;

        return Task.CompletedTask;
    }

    protected override Task FillEntityAsync(Challenge entity, ChallengeDbo dbo)
    {
        entity.Description = dbo.Description;
        entity.Id = dbo.Id;
        entity.Theme = dbo.Theme;
        entity.Title = dbo.Title;

        return Task.CompletedTask;
    }
}