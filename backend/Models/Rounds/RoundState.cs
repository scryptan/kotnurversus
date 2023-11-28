namespace Models.Rounds;

public enum RoundState
{
    None,
    Created,
    Initiated,
    Prepare,
    Presentation,
    Defense,
    Mark,
    Complete,
    Pause
}