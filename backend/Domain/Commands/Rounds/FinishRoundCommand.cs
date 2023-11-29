using Domain.Context;
using Domain.Services.Games;
using Domain.Services.Rounds;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models;
using Models.Games;
using Models.Rounds;
using Newtonsoft.Json.Serialization;

namespace Domain.Commands.Rounds;

public class FinishRoundCommand : IFinishRoundCommand
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IRoundsService roundsService;
    private readonly IGamesService gamesService;

    public FinishRoundCommand(
        IDataContextAccessor dataContextAccessor,
        IRoundsService roundsService,
        IGamesService gamesService)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.roundsService = roundsService;
        this.gamesService = gamesService;
    }

    public async Task<DomainResult<Round, InvalidRoundDataReason>> RunAsync(Guid id, List<MarkRoundRequest> marks)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<Round, InvalidRoundDataReason>>(
            async dbContext =>
            {
                var round = await roundsService.FindAsync(id);
                if (round == null)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Round not found");

                if (round.CurrentState!.State != RoundState.Mark)
                    return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't finish round not in mark state");

                foreach (var mark in marks)
                    round = await roundsService.SetMark(round.Id, (mark.TeamId, mark.Mark));

                if (round.NextRoundId == null)
                {
                    var game = await gamesService.FindAsync(round.GameId);
                    if (game == null)
                        return new ErrorInfo<InvalidRoundDataReason>(InvalidRoundDataReason.InvalidData, "Can't finish round in not existing game");

                    await gamesService.PatchAsync(
                        game,
                        new JsonPatchDocument<Game>(
                            new List<Operation<Game>>()
                            {
                                new()
                                {
                                    op = "replace",
                                    path = "state",
                                    value = GameState.Complete
                                }
                            },
                            new DefaultContractResolver()));
                }

                await dbContext.SaveChangesAsync();
                return round;
            });

        return result;
    }
}