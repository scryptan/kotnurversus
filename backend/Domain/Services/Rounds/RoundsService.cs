using Db.Dbo.Rounds;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Services.Rounds;

public class RoundsService : EntityServiceBase<Round, RoundDbo>
{
    public RoundsService(IDataContext context)
        : base(context, x => x.Rounds)
    {
    }

    protected override Task FillDboAsync(RoundDbo dbo, Round entity) => Task.CompletedTask;

    protected override Task FillEntityAsync(Round entity, RoundDbo dbo) => Task.CompletedTask;
}