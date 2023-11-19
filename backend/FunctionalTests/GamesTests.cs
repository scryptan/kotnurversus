using FluentAssertions;
using FunctionalTests.Base;
using Models.Games;
using Models.Settings;

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
}