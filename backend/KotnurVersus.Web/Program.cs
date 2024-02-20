using System.Reflection;
using Db;
using KotnurVersus.Web.Authorization;
using KotnurVersus.Web.Configuration;
using KotnurVersus.Web.Helpers;
using KotnurVersus.Web.Helpers.DI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Vostok.Applications.AspNetCore;
using Vostok.Commons.Time;
using Vostok.Configuration;
using Vostok.Configuration.Sources.Combined;
using Vostok.Configuration.Sources.Environment;
using Vostok.Configuration.Sources.Json;
using Vostok.Hosting.Abstractions;
using Vostok.Hosting.AspNetCore;
using Vostok.Hosting.Setup;
using Vostok.Logging.Abstractions;
using Vostok.Logging.Console;
using Vostok.Logging.Context;
using ConfigurationProvider = Vostok.Configuration.ConfigurationProvider;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services
    .AddControllers()
    .AddNewtonsoftJson(
        options =>
        {
            options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver
                {NamingStrategy = new CamelCaseNamingStrategy(false, true)};
            options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            options.SerializerSettings.Formatting = Formatting.None;
            options.SerializerSettings.FloatParseHandling = FloatParseHandling.Decimal;
            options.SerializerSettings.Converters.Add(new StringEnumConverter(new CamelCaseNamingStrategy()));
        });

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

var configurationProvider = new ConfigurationProvider(new ConfigurationProviderSettings());
configurationProvider.SetupSourceFor<WebSecrets>(new CombinedSource(new JsonFileSource("config/config.json"), new EnvironmentVariablesSource()));

builder.Services.AddTransient<IAuthorizationHandler, AuthorizedHandler>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(
        options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = JwtTokens.SigningKey(configurationProvider.Get<WebSecrets>().JwtKey)
            };
        });

builder.Services.AddAuthorization(
    opts =>
    {
        opts.AddPolicy("AuthorizedReq", policy => policy.Requirements.Add(new AuthorizedRequirement()));
        opts.DefaultPolicy = new AuthorizationPolicy(
            new[] {new AuthorizedRequirement()},
            new[] {JwtBearerDefaults.AuthenticationScheme});
    });

var assemblyHelper = new AssemblyHelpers();
var applicationAssemblies = new List<Assembly>(assemblyHelper.Assemblies);
builder.Services.AddApplicationServices(
    new ConsoleLog(),
    applicationAssemblies.Distinct().ToArray(),
    assemblyHelper.ExcludeDiTypes.ToHashSet());

builder.Services.AddLazy();
builder.Services.AddSwaggerGenNewtonsoftSupport();

builder.Services.AddVostokRequestLogging(_ => {});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.AddSecurityDefinition(
            "Bearer",
            new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Bearer",
            });

        c.AddSecurityRequirement(
            new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
    });
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseVostokRequestLogging();
app.UseHttpsRedirection();
app.UseCors(
    x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed(_ => true)); // Allow any origin

app.UseAuthentication();
app.UseAuthorization();

var staticFileOptions = new StaticFileOptions
{
    ContentTypeProvider = new FileExtensionContentTypeProvider {Mappings = {[".webmanifest"] = "application/manifest+json"}},
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers[HeaderNames.CacheControl] =
            "public,max-age=" + 24.Hours().TotalSeconds;

        if (ctx.File.Name == "remoteEntry.js")
            ctx.Context.Response.Headers[HeaderNames.CacheControl] = "no-cache";
    },
};
app.UseStaticFiles(staticFileOptions);

app.MapControllers();

app.MapFallbackToFile("index.html");

for (var i = 0; i < 5; i++)
{
    try
    {
        await app.Services.GetService<IDbContextFactory>()!.CreateDbContext().Database.MigrateAsync();
        break;
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        await Task.Delay(TimeSpan.FromSeconds(1));
        if (i == 4)
            throw;
    }
}

app.Run();