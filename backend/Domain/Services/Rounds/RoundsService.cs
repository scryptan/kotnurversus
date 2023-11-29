using Db.Dbo.Rounds;
using Domain.Context;
using Domain.Services.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models;
using Models.Rounds;
using Newtonsoft.Json.Serialization;

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

    protected override async Task PreprocessAsync(Round? entity)
    {
        if (entity == null)
            return;

        if (entity.NextRoundId != null)
        {
            var nextRound = await FindAsync(entity.NextRoundId.Value);
            if (nextRound == null)
                throw new EntityNotFoundException($"Next round with id: {entity.NextRoundId} not found");
        }
    }

    public async Task<Round> AddHistoryItem(Guid roundId, HistoryItem item)
    {
        var existing = await FindAsync(roundId);
        if (existing == null)
            throw new EntityNotFoundException($"Rounnd with id: {roundId} doesn't exists");

        item.Order = existing.History.Count;

        await PatchAsync(
            existing,
            new JsonPatchDocument<Round>(
                new List<Operation<Round>>
                {
                    new()
                    {
                        op = "add",
                        path = "history/-",
                        value = item
                    }
                },
                new DefaultContractResolver()));

        return existing;
    }

    public async Task<Round> UpdateCurrentHistory(Round round)
    {
        var existing = await FindAsync(round.Id);
        if (existing == null)
            throw new EntityNotFoundException($"Round with id: {round.Id} doesn't exists");

        await PatchAsync(
            existing,
            new JsonPatchDocument<Round>(
                new List<Operation<Round>>
                {
                    new()
                    {
                        op = "replace",
                        path = "history",
                        value = round.History
                    }
                },
                new DefaultContractResolver()));

        return existing;
    }

    public async Task<Round> SetMark(Guid roundId, (Guid teamId, int amout) mark)
    {
        var existing = await FindAsync(roundId);
        if (existing == null)
            throw new EntityNotFoundException($"Round with id: {roundId} doesn't exists");

        existing.Participants.Single(x => x.TeamId == mark.teamId).Points = mark.amout;
        await PatchAsync(
            existing,
            new JsonPatchDocument<Round>(
                new List<Operation<Round>>
                {
                    new()
                    {
                        op = "replace",
                        path = "participants",
                        value = existing.Participants
                    }
                },
                new DefaultContractResolver()));

        return existing;
    }
}