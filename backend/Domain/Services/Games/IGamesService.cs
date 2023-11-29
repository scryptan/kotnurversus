using Domain.Services.Base;
using Models.Games;

namespace Domain.Services.Games;

public interface IGamesService : IEntityService<Game, GameSearchRequest>
{
    Task DeleteAllRounds(Guid gameId);
}