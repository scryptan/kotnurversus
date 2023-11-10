using System.Reflection;
using Core.Helpers;
using Db;
using Domain;

namespace KotnurVersus.Web.Helpers;

public class AssemblyHelpers
{
    public IEnumerable<Assembly> Assemblies => new[]
    {
        GetType().Assembly, // entry
        typeof(DbContext).Assembly, // Db
        typeof(Serializer).Assembly, // Core
        typeof(DbContextHelpers).Assembly, // Domain
    };

    public virtual IEnumerable<Type> ExcludeDiTypes { get; } = Array.Empty<Type>();
}