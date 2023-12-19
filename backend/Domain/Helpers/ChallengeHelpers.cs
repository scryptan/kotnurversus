using Db.Dbo.Challenges;
using Models.Challenges;

namespace Domain.Helpers;

public static class ChallengeHelpers
{
    public static SnapshotChallengeDbo ToSnapshot(this ChallengeDbo challengeDbo, Guid gameId, Guid roundId, int order)
    {
        return new SnapshotChallengeDbo
        {
            Id = challengeDbo.Id,
            Description = challengeDbo.Description,
            CategoryId = challengeDbo.CategoryId,
            Title = challengeDbo.Title,
            GameId = gameId,
            RoundId = roundId,
            Order = order,
            IsCatInBag = challengeDbo.IsCatInBag
        };
    }

    public static SnapshotChallengeDbo ToDbModel(this SnapshotChallenge challenge)
    {
        return new SnapshotChallengeDbo
        {
            Id = challenge.Id,
            Description = challenge.Description,
            CategoryId = challenge.CategoryId,
            Title = challenge.Title,
            GameId = challenge.GameId,
            RoundId = challenge.RoundId,
            Order = challenge.Order,
            IsCatInBag = challenge.IsCatInBag
        };
    }

    public static SnapshotChallenge ToApiModel(this SnapshotChallengeDbo challenge)
    {
        return new SnapshotChallenge
        {
            Id = challenge.Id,
            Description = challenge.Description,
            CategoryId = challenge.CategoryId,
            Title = challenge.Title,
            GameId = challenge.GameId,
            RoundId = challenge.RoundId,
            Order = challenge.Order,
            IsCatInBag = challenge.IsCatInBag
        };
    }
}