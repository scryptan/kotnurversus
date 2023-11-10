using System.Diagnostics.CodeAnalysis;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Core.Helpers;

public static class Serializer
{
    private static readonly JsonSerializerSettings jsonSerializerSettings = new()
    {
        Formatting = Formatting.None,
        NullValueHandling = NullValueHandling.Ignore,
        FloatParseHandling = FloatParseHandling.Decimal,
        ContractResolver = new CamelCasePropertyNamesContractResolver {NamingStrategy = new CamelCaseNamingStrategy(false, true)},
        Converters =
        {
            new StringEnumConverter(new CamelCaseNamingStrategy())
        }
    };

    public static JToken FromObject(object o)
    {
        return JToken.FromObject(o, JsonSerializer.Create(jsonSerializerSettings));
    }

    public static T ToObject<T>(JToken token)
    {
        return token.ToObject<T>(JsonSerializer.Create(jsonSerializerSettings)) ?? throw new InvalidOperationException("Converted to null");
    }

    public static string Serialize(object? data) => JsonConvert.SerializeObject(data, jsonSerializerSettings);

    public static T Deserialize<T>(string s) => JsonConvert.DeserializeObject<T>(s, jsonSerializerSettings) ?? throw new InvalidOperationException("Deserialized to null");

    [return: MaybeNull]
    public static T DeserializeOrNull<T>(string? s) => string.IsNullOrEmpty(s) ? default : JsonConvert.DeserializeObject<T>(s, jsonSerializerSettings);

    public static object? Deserialize(Type type, string s) => JsonConvert.DeserializeObject(s, type, jsonSerializerSettings);
}