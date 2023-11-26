using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class GetChallengeCommand : GetCommandBase<Challenge>
{
    public GetChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityService<Challenge> repository)
        : base(dataContextAccessor, repository)
    {
    }
}