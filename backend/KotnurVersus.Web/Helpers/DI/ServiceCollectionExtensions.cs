using System.Reflection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Vostok.Logging.Abstractions;

namespace KotnurVersus.Web.Helpers.DI;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        ILog log,
        Assembly[] assemblies,
        HashSet<Type> excludeTypes)
    {
        log = log.ForContext(typeof(ServiceCollectionExtensions));
        foreach (var assembly in assemblies)
        {
            foreach (var type in assembly.GetTypes())
            {
                if (excludeTypes.Contains(type))
                    continue;
                if (type.IsAbstract || type.IsInterface || !type.IsPublic ||
                    type.GetCustomAttributes<IgnoredTypeAttribute>().Any())
                    continue;
                if (services.Any(x => x.ServiceType == type))
                    continue;

                log.Debug($"Registering type: {type} as self");
                services.AddSingleton(type, type);
                foreach (var interfaceType in type.GetInterfaces())
                {
                    if (assemblies.Contains(interfaceType.Assembly))
                    {
                        log.Debug($"    as interface: {interfaceType}");
                        services.AddSingleton(interfaceType, x => x.GetRequiredService(type));
                    }
                }
            }
        }

        return services;
    }

    public static IServiceCollection AddLazy(
        this IServiceCollection services)
    {
        return services.AddTransient(typeof(Lazy<>), typeof(Lazier<>));
    }

    private class Lazier<T> : Lazy<T>
        where T : notnull
    {
        public Lazier(IServiceProvider serviceProvider)
            : base(serviceProvider.GetRequiredService<T>)
        {
        }
    }

    public static IServiceCollection AddInstanceWithInterfaces(
        this IServiceCollection services,
        object instance)
    {
        foreach (var type in new[] {instance.GetType()}.Concat(instance.GetType().GetInterfaces()))
            services.AddSingleton(type, instance);

        return services;
    }

    public static IServiceCollection AddSingletonWithInterfaces<T>(this IServiceCollection services)
        where T : class
    {
        services.AddSingleton<T>();
        foreach (var type in typeof(T).GetInterfaces())
            services.AddSingleton(type, x => x.GetRequiredService<T>());

        return services;
    }

    public static IServiceCollection ReplaceInstanceWithInterfaces(
        this IServiceCollection services,
        object instance)
    {
        foreach (var type in new[] {instance.GetType()}.Concat(instance.GetType().GetInterfaces()))
        {
            services.RemoveAll(type);
            services.AddSingleton(type, instance);
        }

        return services;
    }
}