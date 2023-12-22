using Domain.Context;
using Domain.Helpers;
using Domain.Services.Games;
using Domain.Services.Rounds;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Rounds;
using Models.Rounds.History;

namespace Domain.Commands.Rounds;

public class StartRoundCommand : IStartRoundCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IRoundsService service;
    private readonly IGamesService gamesService;

    private static readonly Random random = new();

    public StartRoundCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService service,
        IGamesService gamesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.service = service;
        this.gamesService = gamesService;
    }

    public async Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<Round, InvalidRoundDataReason>>(
            async dbContext =>
            {
                var existing = await service.FindAsync(id);
                if (existing == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not found");

                if (existing.History.FirstOrDefault(x => x.State == RoundState.Prepare) != null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round already started");

                var game = await gamesService.FindAsync(existing.GameId);
                if (game == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Game not found");

                await service.AddHistoryItem(
                    existing.Id,
                    new HistoryItem
                    {
                        Order = 0,
                        Value = new PrepareRoundHistoryItem()
                    });

                var challenges = await dbContext.Challenges.ToListAsync();
                if (game.Settings.CatsInTheBag)
                {
                    var categories = challenges.Select(x => x.CategoryId).Distinct().ToList();
                    var cats = challenges.Where(x => x.IsCatInBag).ToList();
                    foreach (var cat in cats)
                    {
                        cat.CategoryId = categories
                            .Where(x => x != cat.CategoryId)
                            .ElementAt(random.Next(categories.Count));
                    }
                }

                foreach (var group in challenges.GroupBy(x => x.CategoryId))
                {
                    var challengeOrders = Enumerable.Range(0, group.Count()).OrderBy(_ => random.Next()).ToList();
                    var i = 0;
                    foreach (var challengeDbo in group)
                    {
                        var order = challengeOrders[i++];
                        var snapshot = challengeDbo.ToSnapshot(existing.GameId, existing.Id, order);
                        await dbContext.SnapshotChallenges.AddAsync(snapshot);
                    }
                }

                await dbContext.SaveChangesAsync();
                return existing;
            });

        return result;
    }
}