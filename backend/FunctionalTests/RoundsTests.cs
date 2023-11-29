using Core.Helpers;
using FluentAssertions;
using FunctionalTests.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models.Rounds;
using Models.Rounds.History;
using Models.Settings;
using Models.Specifications;
using Newtonsoft.Json.Serialization;
using Vostok.Logging.Abstractions;

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
    public async Task Patch_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new RoundCreationArgs
        {
            GameId = Guid.NewGuid(),
            Order = 1,
            Specification = new Specification
            {
                Title = "Title",
                BusinessDescription = "asda",
                TechDescription = "RoundHistoryItemBase"
            }
        };
        var defaultSettings = new Settings();
        var entityRes = await Client.Rounds.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var newHistory = new List<HistoryItem>
        {
            new()
            {
                Order = 0,
                Value = new PrepareRoundHistoryItem
                {
                    Start = DateTimeOffset.Now,
                    End = DateTimeOffset.Now,
                }
            }
        };
        var result = await Client.Rounds.PatchAsync(
            entity.Id,
            new JsonPatchDocument<Round>(
                new List<Operation<Round>>
                {
                    new()
                    {
                        op = "replace",
                        path = "/history",
                        value = newHistory
                    }
                },
                new DefaultContractResolver()));
        result.EnsureSuccess();

        entity = result.Result;
        Log.Warn(Serializer.Serialize(entity));

        entity.Id.Should().NotBe(Guid.Empty);
        entity.Settings.Should().Be(defaultSettings);
        entity.GameId.Should().Be(creationArgs.GameId);
        entity.Order.Should().Be(creationArgs.Order);
        entity.Artifacts.Should().BeEmpty();
        entity.History.Should().BeEquivalentTo(newHistory);
        entity.Specification.Should().BeEquivalentTo(creationArgs.Specification);
        entity.CurrentState.Should().BeEquivalentTo(newHistory.Single());
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

    [Test]
    public async Task Search_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new RoundCreationArgs
        {
            GameId = Guid.NewGuid(),
            Order = 1
        };

        var entityRes = await Client.Rounds.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var searchAsync = await Client.Rounds.SearchAsync();
        searchAsync.EnsureSuccess();

        searchAsync.Result.Count.Should().BeGreaterThan(0);
    }
}