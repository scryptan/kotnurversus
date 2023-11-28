using FluentAssertions;
using FunctionalTests.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models.Categories;
using Models.Challenges;
using Newtonsoft.Json.Serialization;

namespace FunctionalTests;

public class ChallengesTests : ApiTestBase
{
    private Guid categoryId;
    [OneTimeSetUp]
    public async Task Setup()
    {
        var result = await Client.Categories.CreateAsync(new CategoryCreationArgs
        {
            Title = $"Категория {Guid.NewGuid()}",
            Color = "#FFFFFF"
        });
        
        categoryId = result.Result.Id;
    }
    
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Category = categoryId,
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var result = await Client.Challenges.CreateAsync(creationArgs);

        result.EnsureSuccess();
        var entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(creationArgs.Description);
        entity.CategoryId.Should().Be(creationArgs.Category);
        entity.Title.Should().Be(creationArgs.Title);
    }

    [Test]
    public async Task Get_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Category = categoryId,
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var entityRes = await Client.Challenges.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var result = await Client.Challenges.GetAsync(entity.Id);
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(creationArgs.Description);
        entity.CategoryId.Should().Be(creationArgs.Category);
        entity.Title.Should().Be(creationArgs.Title);
    }

    [Test]
    public async Task Patch_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Category = categoryId,
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var entityRes = await Client.Challenges.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var newDescription = "My favorite desrioption";
        var result = await Client.Challenges.PatchAsync(
            entity.Id,
            new JsonPatchDocument<Challenge>(
                new List<Operation<Challenge>>
                {
                    new()
                    {
                        op = "replace",
                        path = "/description",
                        value = newDescription
                    }
                },
                new DefaultContractResolver()));
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(newDescription);
        entity.CategoryId.Should().Be(creationArgs.Category);
        entity.Title.Should().Be(creationArgs.Title);
    }

    [Test]
    public async Task Delete_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Category = categoryId,
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var entityRes = await Client.Challenges.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var deleteRes = await Client.Challenges.DeleteAsync(entity.Id);
        deleteRes.EnsureSuccess();

        var result = await Client.Challenges.GetAsync(entity.Id);
        result.EnsureErrorInfo();
    }

    [Test]
    public async Task Search_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Category = categoryId,
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var entityRes = await Client.Challenges.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var searchAsync = await Client.Challenges.SearchAsync();
        searchAsync.EnsureSuccess();

        searchAsync.Result.Count.Should().BeGreaterThan(0);
    }
}