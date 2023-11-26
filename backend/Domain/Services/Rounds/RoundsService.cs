using Db.Dbo.Rounds;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Services.Rounds;

public class RoundsService : EntityServiceBase<Round, RoundDbo, RoundSearchRequest>, IRoundsService
{
    public RoundsService(IDataContext context)
        : base(context, x => x.Rounds)
    {
    }

    protected override Task FillDboAsync(RoundDbo dbo, Round entity)
    {
        dbo.Id = entity.Id;
        dbo.Artifacts = entity.Artifacts;
        dbo.Participants = entity.Participants;
        dbo.Specification = entity.Specification;
        dbo.NextRoundId = entity.NextRoundId;
        dbo.History = entity.History;
        dbo.Order = entity.Order;
        dbo.GameId = entity.GameId;
        dbo.Settings = entity.Settings;

        return Task.CompletedTask;
    }

    protected override Task FillEntityAsync(Round entity, RoundDbo dbo)
    {
        entity.Id = dbo.Id;
        entity.Artifacts = dbo.Artifacts;
        entity.Participants = dbo.Participants;
        entity.Specification = dbo.Specification;
        entity.NextRoundId = dbo.NextRoundId;
        entity.History = dbo.History;
        entity.Order = dbo.Order;
        entity.GameId = dbo.GameId;
        entity.Settings = dbo.Settings;

        entity.CurrentState = dbo.History.MaxBy(x => x.Order);
        entity.WinnerId = dbo.Participants.FirstOrDefault(x => x.IsWinner)?.TeamId;

        return Task.CompletedTask;
    }

    protected override async Task<IQueryable<RoundDbo>> ApplyFilterAsync(IQueryable<RoundDbo> queryable, RoundSearchRequest searchRequest)
    {
        var res = queryable;

        if (searchRequest.GameId != null)
            res = res.Where(x => x.GameId == searchRequest.GameId);

        res = await base.ApplyFilterAsync(res, searchRequest);
        return res;
    }
}