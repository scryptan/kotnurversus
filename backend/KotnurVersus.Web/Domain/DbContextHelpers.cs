namespace Domain;

public class DbContextHelpers
{
    public static DateTimeOffset Now()
    {
        return ConvertDate(DateTimeOffset.UtcNow);
    }

    public static DateTimeOffset ConvertDate(DateTimeOffset date)
    {
        var ticks = date.UtcTicks;
        return new DateTimeOffset(ticks - ticks % 10, TimeSpan.Zero);
    }
}