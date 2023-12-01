using Models.Rounds;
using Models.Rounds.History;

namespace Domain.Helpers;

public static class RoundHelpers
{
    public static Round ToApiModel(this RoundCreationArgs args) => new()
    {
        GameId = args.GameId,
        NextRoundId = args.NextRoundId,
        Order = args.Order,
        Specification = args.Specification,
        Settings = args.Settings ?? new(),
        Artifacts = new(),
        History = new(),
        Participants = args.Participants ?? new List<Participant>()
    };
}