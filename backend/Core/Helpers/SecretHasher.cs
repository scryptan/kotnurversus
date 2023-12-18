using System.Security.Cryptography;

namespace Core.Helpers;

public static class SecretHasher
{
    private const int saltSize = 16; // 128 bits
    private const int keySize = 32; // 256 bits
    private const int iterations = 50000;
    private static readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA256;

    private const char segmentDelimiter = ':';

    public static string Hash(string input)
    {
        var salt = RandomNumberGenerator.GetBytes(saltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            input,
            salt,
            iterations,
            hashAlgorithm,
            keySize
        );

        return string.Join(
            segmentDelimiter,
            Convert.ToHexString(hash),
            Convert.ToHexString(salt),
            iterations,
            hashAlgorithm
        );
    }

    public static bool Verify(string input, string hashString)
    {
        var segments = hashString.Split(segmentDelimiter);
        var hash = Convert.FromHexString(segments[0]);
        var salt = Convert.FromHexString(segments[1]);
        var parsedIterations = int.Parse(segments[2]);
        var algorithm = new HashAlgorithmName(segments[3]);
        var inputHash = Rfc2898DeriveBytes.Pbkdf2(
            input,
            salt,
            parsedIterations,
            algorithm,
            hash.Length
        );

        return CryptographicOperations.FixedTimeEquals(inputHash, hash);
    }
}