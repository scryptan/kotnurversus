using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Rounds;

namespace Domain.Commands.Rounds;

public class SearchRoundCommand : SearchCommandBase<Round, RoundSearchRequest>
{
    public SearchRoundCommand(IEntityService<Round, RoundSearchRequest> service, IDataContextAccessor dataContextAccessor)
        : base(service, dataContextAccessor)
    {
    }
}