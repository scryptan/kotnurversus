using Vostok.Clusterclient.Core.Model;

namespace Client;

public class ApiClientException : Exception
{
    public ApiClientException(ResponseCode responseCode, string? message)
        : base($"Api call failed with code: {responseCode}: {message}".Trim(' ', ':'))
    {
        ResponseCode = responseCode;
    }

    public ResponseCode ResponseCode { get; }
}