using Vostok.Hosting.Abstractions;
using IConfigurationProvider = Vostok.Configuration.Abstractions.IConfigurationProvider;

namespace KotnurVersus.Web.Configuration;

public class WebSettings : IWebSettings
{
    private readonly IVostokHostingEnvironment environment;

    public WebSettings(IVostokHostingEnvironment environment)
    {
        this.environment = environment;
    }

    public string ConnectionString => ConfigurationProvider.Get<WebSecrets>().DbConnectionString;
    public int MaxRetryOnFailureCount => 5;

    private IConfigurationProvider ConfigurationProvider => environment.ConfigurationProvider;
}