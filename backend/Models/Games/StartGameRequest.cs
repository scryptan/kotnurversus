using Models.Rounds;

namespace Models.Games;

public class StartGameRequest
{
    public List<RoundCreationArgs> RoundsToCreate { get; set; } = null!;
}