using Domain.Services.Base;
using Models.Games;

namespace Domain.Services.Games;

public interface IGamesService : IEntityService<Game>
{
    Task DeleteAllRounds(Guid gameId);
}