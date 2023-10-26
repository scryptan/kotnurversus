using Vostok.Logging.Abstractions;

namespace Core;

public static class LogExtensions
{
    private static readonly Dictionary<LogLevel, LogLevel> logLevels = new()
    {
        {LogLevel.Info, LogLevel.Debug},
        {LogLevel.Warn, LogLevel.Debug},
        {LogLevel.Error, LogLevel.Debug},
    };

    public static ILog ForContext(this ILog log, object context)
    {
        return LogContextExtensions.ForContext(log, context.GetType());
    }

    public static ILog WithAllLevelsTransformedToDebug(this ILog log)
    {
        return new LogWithOriginalLevelAdapter(log).WithLevelsTransformation(logLevels);
    }

    public static ILog TransformErrorsToWarnings(this ILog log)
    {
        return log.WithLevelsTransformation(new Dictionary<LogLevel, LogLevel> {{LogLevel.Error, LogLevel.Warn}});
    }

    private class LogWithOriginalLevelAdapter : ILog
    {
        private readonly ILog baseLog;

        public LogWithOriginalLevelAdapter(ILog baseLog)
        {
            this.baseLog = baseLog;
        }

        public void Log(LogEvent @event)
        {
            baseLog.Log(@event?.WithMessageTemplate($"[{@event.Level}] {@event.MessageTemplate}"));
        }

        public bool IsEnabledFor(LogLevel level) => baseLog.IsEnabledFor(level);

        public ILog ForContext(string context)
        {
            var baseLogForContext = baseLog.ForContext(context);
            return baseLogForContext != baseLog ? new LogWithOriginalLevelAdapter(baseLogForContext) : this;
        }
    }
}