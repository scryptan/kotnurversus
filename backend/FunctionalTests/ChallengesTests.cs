using FunctionalTests.Base;
using Models.Challenges;

namespace FunctionalTests;

public class ChallengesTests : ApiTestBase
{
    [Test]
    public async Task Create_WithCorrectData_ShouldBeSuccessful()
    {
        var result = await Client.Challenges.CreateAsync(
            new ChallengeCreationArgs
            {
                Description = "Some me",
                Theme = "Cat in the box",
                Title = "Im Bob Cat"
            });
     
        result.EnsureSuccess();
    }
}