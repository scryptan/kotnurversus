using Models;

namespace Domain.Commands.Games;

public interface IDeleteAllRoundsInGameCommand
{
    Task<VoidDomainResult<AccessMultipleEntitiesError>> RunAsync(Guid id);
}