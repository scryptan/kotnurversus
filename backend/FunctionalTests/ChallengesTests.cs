using FluentAssertions;
using FunctionalTests.Base;
using Models.Challenges;

namespace FunctionalTests;

public class ChallengesTests : ApiTestBase
{
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Theme = "Cat in the box",
            Title = $"Im Bob Cat {Guid.NewGuid()}"
        };

        var result = await Client.Challenges.CreateAsync(creationArgs);

        result.EnsureSuccess();
        var entity = result.Result;
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Description.Should().Be(creationArgs.Description);
        entity.Theme.Should().Be(creationArgs.Theme);
        entity.Title.Should().Be(creationArgs.Title);
    }

    [Test]
    public async Task Get_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Theme = "Cat in the box",
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
        entity.Theme.Should().Be(creationArgs.Theme);
        entity.Title.Should().Be(creationArgs.Title);
    }

    [Test]
    public async Task Delete_CreatedWithCorrectData_ShouldBeSuccessful()
    {
        var creationArgs = new ChallengeCreationArgs
        {
            Description = "Some me",
            Theme = "Cat in the box",
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
}