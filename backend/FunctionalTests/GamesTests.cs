using Core.Helpers;
using FluentAssertions;
using FunctionalTests.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models.Games;
using Models.Settings;
using Newtonsoft.Json.Serialization;
using Vostok.Logging.Abstractions;

namespace FunctionalTests;

public class GamesTests : ApiTestBase
{
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new GameCreationArgs
        {
            Description = "Some me",
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            StartDate = DateTimeOffset.Now,
            Settings = new Settings(),
            Form = GameForm.Online,
        };

        var result = await Client.Games.CreateAsync(creationArgs);

        result.EnsureSuccess();
        var entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(creationArgs.Description);
        entity.Title.Should().Be(creationArgs.Title);
        entity.StartDate.Should().Be(creationArgs.StartDate);
        entity.Form.Should().Be(creationArgs.Form);
        entity.Settings.Should().Be(creationArgs.Settings);
    }

    [Test]
    public async Task Get_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new GameCreationArgs
        {
            Description = "Some me",
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            StartDate = DateTimeOffset.Now,
            Settings = new Settings(),
            Form = GameForm.Online,
        };

        var entityRes = await Client.Games.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var result = await Client.Games.GetAsync(entity.Id);
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(creationArgs.Description);
        entity.Title.Should().Be(creationArgs.Title);
        entity.StartDate.Should().Be(creationArgs.StartDate);
        entity.Form.Should().Be(creationArgs.Form);
        entity.Settings.Should().Be(creationArgs.Settings);
    }

    [Test]
    public async Task Patch_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new GameCreationArgs
        {
            Description = "Some me",
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            StartDate = DateTimeOffset.Now,
            Settings = new Settings(),
            Form = GameForm.Online,
        };

        var entityRes = await Client.Games.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var newDescription = "Meow meow meoew";
        var result = await Client.Games.PatchAsync(
            entity.Id,
            new JsonPatchDocument<Game>(
                new List<Operation<Game>>
                {
                    new()
                    {
                        op = "replace",
                        path = "description",
                        value = newDescription
                    },
                    new()
                    {
                        op = "replace",
                        path = "settings/timeoutsCount",
                        value = 3
                    }
                },
                new DefaultContractResolver()));
        result.EnsureSuccess();
        creationArgs.Settings.TimeoutsCount = 3;

        var res = await Client.Games.GetAsync(entity.Id);
        entity = res.Result;

        Log.Info(Serializer.Serialize(entity));
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(newDescription);
        entity.Title.Should().Be(creationArgs.Title);
        entity.StartDate.Should().Be(creationArgs.StartDate);
        entity.Form.Should().Be(creationArgs.Form);
        entity.Settings.Should().Be(creationArgs.Settings);
    }

    [Test]
    public async Task Delete_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new GameCreationArgs
        {
            Description = "Some me",
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            StartDate = DateTimeOffset.Now,
            Settings = new Settings(),
            Form = GameForm.Online,
        };

        var entityRes = await Client.Games.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var entity = entityRes.Result;

        var deleteRes = await Client.Games.DeleteAsync(entity.Id);
        deleteRes.EnsureSuccess();

        var result = await Client.Games.GetAsync(entity.Id);
        result.EnsureErrorInfo();
    }

    [Test]
    public async Task Search_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new GameCreationArgs
        {
            Description = "Some me",
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            StartDate = DateTimeOffset.Now,
            Settings = new Settings(),
            Form = GameForm.Online,
        };

        var entityRes = await Client.Games.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var searchAsync = await Client.Games.SearchAsync();
        searchAsync.EnsureSuccess();

        searchAsync.Result.Count.Should().BeGreaterThan(0);
    }
}