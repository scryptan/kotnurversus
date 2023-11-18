namespace Models.Settings;

public record Settings
{
    public int TimeoutsCount { get; set; } = 2;
    public int TimeoutSeconds { get; set; } = 60;
    public int PrepareSeconds { get; set; } = 20 * 60;
    public int PresentationSeconds { get; set; } = 15 * 60;
    public int DefenseSeconds { get; set; } = 5 * 60;
}