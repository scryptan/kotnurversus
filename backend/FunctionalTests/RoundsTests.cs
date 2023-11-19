using FluentAssertions;
using FunctionalTests.Base;
using Models.Rounds;
using Models.Settings;

namespace FunctionalTests;

public class RoundsTests : ApiTestBase
{
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new RoundCreationArgs
        {
            GameId = Guid.NewGuid(),
            Order = 1
        };
        var defaultSettings = new Settings();
        var result = await Client.Rounds.CreateAsync(creationArgs);

        result.EnsureSuccess();
        var entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Settings.Should().Be(defaultSettings);
        entity.GameId.Should().Be(creationArgs.GameId);
        entity.Order.Should().Be(creationArgs.Order);
        entity.Artifacts.Should().BeEmpty();
        entity.History.Should().BeEmpty();
        entity.Specification.Should().BeNull();
        entity.CurrentState.Should().BeNull();
        entity.WinnerId.Should().BeNull();
        entity.NextRoundId.Should().BeNull();
    }

    [Test]
    public async Task Get_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new RoundCreationArgs
        {
            GameId = Guid.NewGuid(),
            Order = 1
        };
        var defaultSettings = new Settings();
        var entityRes = await Client.Rounds.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var result = await Client.Rounds.GetAsync(entity.Id);
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Settings.Should().Be(defaultSettings);
        entity.GameId.Should().Be(creationArgs.GameId);
        entity.Order.Should().Be(creationArgs.Order);
        entity.Artifacts.Should().BeEmpty();
        entity.History.Should().BeEmpty();
        entity.Specification.Should().BeNull();
        entity.CurrentState.Should().BeNull();
        entity.WinnerId.Should().BeNull();
        entity.NextRoundId.Should().BeNull();
    }

    [Test]
    public async Task Delete_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new RoundCreationArgs
        {
            GameId = Guid.NewGuid(),
            Order = 1
        };
        var entityRes = await Client.Rounds.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var entity = entityRes.Result;

        var deleteRes = await Client.Rounds.DeleteAsync(entity.Id);
        deleteRes.EnsureSuccess();

        var result = await Client.Rounds.GetAsync(entity.Id);
        result.EnsureErrorInfo();
    }
}