using System.Reflection;

namespace KotnurVersus.Web.Helpers;

public class AssemblyHelpers
{
    public IEnumerable<Assembly> Assemblies => new[]
    {
        GetType().Assembly, // entry
    };

    public virtual IEnumerable<Type> ExcludeDiTypes { get; } = Array.Empty<Type>();
}