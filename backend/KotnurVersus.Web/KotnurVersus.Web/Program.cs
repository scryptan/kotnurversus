using System.Reflection;
using KotnurVersus.Web.Helpers;
using KotnurVersus.Web.Helpers.DI;
using Vostok.Logging.Console;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.WebHost.UseUrls("https://0.0.0.0/");
builder.Services.AddControllers();

var assemblyHelper = new AssemblyHelpers();
var applicationAssemblies = new List<Assembly>(assemblyHelper.Assemblies);
builder.Services.AddApplicationServices(new ConsoleLog(),
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