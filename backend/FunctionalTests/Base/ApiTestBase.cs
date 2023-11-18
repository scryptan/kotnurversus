using Client;
using Vostok.Logging.Abstractions;
using Vostok.Logging.Console;

namespace FunctionalTests.Base;

public abstract class ApiTestBase
{
    protected IApiClient Client;
    protected ILog Log;

    [OneTimeSetUp]
    public void SetUp()
    {
        Log = new SynchronousConsoleLog();
        Client = new ApiClient(new Uri("http://localhost:4001"), Log);
    }
}