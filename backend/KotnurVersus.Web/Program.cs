using System.Reflection;
using KotnurVersus.Web.Configuration;
using KotnurVersus.Web.Helpers;
using KotnurVersus.Web.Helpers.DI;
using Vostok.Configuration.Sources.Environment;
using Vostok.Hosting.Abstractions;
using Vostok.Hosting.AspNetCore;
using Vostok.Hosting.Setup;
using Vostok.Logging.Abstractions;
using Vostok.Logging.Console;
using Vostok.Logging.Context;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();

builder.UseVostokHosting(
    environmentBuilder =>
    {
        environmentBuilder.DisableClusterConfig();

        environmentBuilder.SetupSystemMetrics(
            settings =>
            {
                settings.EnableProcessMetricsLogging = false;
                settings.EnableGcEventsLogging = false;
                settings.EnableHostMetricsLogging = false;
            });

        environmentBuilder.SetupLog(x => x.SetupConsoleLog());
        environmentBuilder.SetupConfiguration(
            c =>
            {
                c.SetupSourceFor<WebSecrets>();

                c.AddSource(new EnvironmentVariablesSource());
                c.AddJsonFile("config/config.json");
            });

        environmentBuilder.SetPort(4000);
        environmentBuilder.SetupHost();
    });
builder.Services.AddSingleton<ILog>(
    x =>
        x.GetRequiredService<IVostokHostingEnvironment>().Log.WithAllFlowingContextProperties());

var assemblyHelper = new AssemblyHelpers();
var applicationAssemblies = new List<Assembly>(assemblyHelper.Assemblies);
builder.Services.AddApplicationServices(
    new ConsoleLog(),
    applicationAssemblies.Distinct().ToArray(),
    assemblyHelper.ExcludeDiTypes.ToHashSet());

builder.Services.AddLazy();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();