using FluentAssertions;
using FunctionalTests.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Models.Categories;
using Newtonsoft.Json.Serialization;

namespace FunctionalTests;

public class CategoriesTests : ApiTestBase
{
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new CategoryCreationArgs
        {
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            Color = "#FFFFFF"
        };

        var result = await Client.Categories.CreateAsync(creationArgs);

        result.EnsureSuccess();
        var entity = result.Result;

        entity.Id.Should().NotBe(Guid.Empty);
        entity.Title.Should().Be(creationArgs.Title);
        entity.Color.Should().Be(creationArgs.Color);
    }

    [Test]
    public async Task Get_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new CategoryCreationArgs
        {
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            Color = "#FFFFFF"
        };

        var entityRes = await Client.Categories.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var result = await Client.Categories.GetAsync(entity.Id);
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Title.Should().Be(creationArgs.Title);
        entity.Color.Should().Be(creationArgs.Color);
    }

    [Test]
    public async Task Patch_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new CategoryCreationArgs
        {
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            Color = "#FFFFFF"
        };

        var entityRes = await Client.Categories.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var newDescription = "#000000";
        var result = await Client.Categories.PatchAsync(
            entity.Id,
            new JsonPatchDocument<Category>(
                new List<Operation<Category>>
                {
                    new()
                    {
                        op = "replace",
                        path = "/color",
                        value = newDescription
                    }
                },
                new DefaultContractResolver()));
        result.EnsureSuccess();

        entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Title.Should().Be(creationArgs.Title);
        entity.Color.Should().Be(newDescription);
    }

    [Test]
    public async Task Delete_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new CategoryCreationArgs
        {
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            Color = "#FFFFFF"
        };

        var entityRes = await Client.Categories.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();
        var entity = entityRes.Result;

        var deleteRes = await Client.Categories.DeleteAsync(entity.Id);
        deleteRes.EnsureSuccess();

        var result = await Client.Categories.GetAsync(entity.Id);
        result.EnsureErrorInfo();
    }

    [Test]
    public async Task Search_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new CategoryCreationArgs
        {
            Title = $"Im Bob Cat {Guid.NewGuid()}",
            Color = "#FFFFFF"
        };

        var entityRes = await Client.Categories.CreateAsync(creationArgs);

        entityRes.EnsureSuccess();

        var searchAsync = await Client.Categories.SearchAsync();
        searchAsync.EnsureSuccess();

        searchAsync.Result.Count.Should().BeGreaterThan(0);
    }
}