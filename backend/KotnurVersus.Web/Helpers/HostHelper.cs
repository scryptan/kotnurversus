using System.Reflection;
using Vostok.Hosting;
using Vostok.Hosting.Abstractions.Helpers;
using Vostok.Hosting.Setup;

namespace KotnurVersus.Web.Helpers;

public static class HostHelper
{
    public static void SetupHost(this IVostokHostingEnvironmentBuilder environmentBuilder)
    {
        environmentBuilder.SetupHostExtensions(
            extensions =>
            {
                var vostokHostShutdown = new VostokHostShutdown(new CancellationTokenSource());
                extensions.Add(vostokHostShutdown);
                extensions.Add(typeof(IVostokHostShutdown), vostokHostShutdown);
            });
        var appName = Assembly.GetEntryAssembly()?.GetName().Name ?? "unknown";
        environmentBuilder
            .DisableServiceBeacon()
            .SetupApplicationIdentity(
                identityBuilder => identityBuilder
                    .SetProject("KotnurVersus")
                    .SetApplication(appName)
                    .SetEnvironment("local")
                    .SetInstance(Environment.GetEnvironmentVariable("HOSTNAME") ?? $"local_{appName}"));
    }
}