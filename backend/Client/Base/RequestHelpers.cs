using System.Globalization;
using Core.Helpers;
using Models.Search;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Vostok.Clusterclient.Core.Model;

namespace Client.Base;

internal static class RequestHelpers
{
    private static readonly string[] dateFormats =
    {
        "ddd, d MMM yyyy H:m:s 'GMT'",
        "ddd, d MMM yyyy H:m:s",
        "d MMM yyyy H:m:s 'GMT'",
        "d MMM yyyy H:m:s",
        "ddd, d MMM yy H:m:s 'GMT'",
        "ddd, d MMM yy H:m:s",
        "d MMM yy H:m:s 'GMT'",
        "d MMM yy H:m:s",
        "dddd, d'-'MMM'-'yy H:m:s 'GMT'",
        "dddd, d'-'MMM'-'yy H:m:s",
        "ddd, d'-'MMM'-'yyyy H:m:s 'GMT'",
        "ddd MMM d H:m:s yyyy",
        "ddd, d MMM yyyy H:m:s zzz",
        "ddd, d MMM yyyy H:m:s",
        "d MMM yyyy H:m:s zzz",
        "d MMM yyyy H:m:s"
    };

    private static readonly JsonSerializerSettings jsonSerializerSettings = new()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver {NamingStrategy = new CamelCaseNamingStrategy(false, true)},
        Converters =
        {
            new StringEnumConverter(new CamelCaseNamingStrategy()),
        },
        FloatParseHandling = FloatParseHandling.Decimal
    };

    public static Request WithFieldFilter<T>(this Request request, T? filter)
        where T : SearchRequestBase
    {
        if (filter == null)
            return request;

        var url = new RequestUrlBuilder(request.Url.ToString());
        var filterDict = Deserialize<Dictionary<string, object>>(Serialize(filter));
        foreach (var (key, val) in filterDict)
            url.AppendToQuery(key, val);

        return request.WithUrl(url.Build());
    }

    public static Request WithBearerAuthorizationHeader(this Request request, string bearerToken)
    {
        return request.WithAuthorizationHeader("Bearer", bearerToken);
    }

    public static Request WithJsonContent<T>(this Request request, T? content)
        where T : class
    {
        if (ReferenceEquals(content, null))
            return request;
        return request
            .WithContentTypeHeader("application/json")
            .WithContent(Serialize(content));
    }

    public static string Serialize<T>(T data) => JsonConvert.SerializeObject(data, jsonSerializerSettings);

    public static T Deserialize<T>(string data) => Serializer.Deserialize<T>(data) ?? throw new InvalidOperationException("Deserialized to null");

    public static object Deserialize(Type type, string data) => JsonConvert.DeserializeObject(data, type, jsonSerializerSettings) ?? throw new InvalidOperationException("Deserialized to null");

    public static T ToObject<T>(JToken token)
    {
        return token.ToObject<T>(JsonSerializer.Create(jsonSerializerSettings)) ?? throw new InvalidOperationException("Converted to null");
    }

    private static string ToCamelCase(string s)
    {
        if (string.IsNullOrEmpty(s) || !char.IsUpper(s[0]))
            return s;
        var charArray = s.ToCharArray();
        for (var index = 0; index < charArray.Length; ++index)
        {
            var flag = index + 1 < charArray.Length;
            if (index <= 0 || !flag || char.IsUpper(charArray[index + 1]))
                charArray[index] = char.ToLower(charArray[index], CultureInfo.InvariantCulture);
            else
                break;
        }

        return new string(charArray);
    }
}