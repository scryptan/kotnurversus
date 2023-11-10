using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;

namespace Domain.Services.Helpers;

public static class PatchPath<T>
{
    public static string GetPath<TValue>(Expression<Func<T, TValue>> path)
    {
        return PatchPath.GetPath(path);
    }
}

public static class PatchPath
{
    private static readonly MethodInfo byIdMethod = typeof(PatchPath).GetMethod(nameof(ById), BindingFlags.Public | BindingFlags.Static)!;

    public static TItem? ById<TItem, T>(this IList<TItem> list, T id)
        where TItem : class, IItemWithId<T>
    {
        return list.FirstOrDefault(x => Equals(x.Id, id));
    }

    public static string GetPath<T, TValue>(Expression<Func<T, TValue>> path)
    {
        return GetPath(path.Body);
    }

    public static string GetPath(Expression path)
    {
        var list = GetPathSegments(path);
        var result = "/" + string.Join("/", list);
        return result;
    }

    public static string Combine(params string[] paths)
    {
        return "/" + string.Join("/", paths.Select(p => p.Trim('/')));
    }
        
    public static string Combine<T>(string basePath, T key)
    {
        return Combine(basePath, Convert.ToString(key)!);
    }

    private static IEnumerable<string> GetPathSegments(Expression expr)
    {
        var stringList = new List<string>();
        switch (expr.NodeType)
        {
            case ExpressionType.Call
                when expr is MethodCallExpression call
                     && call.Method.IsGenericMethod
                     && call.Method.GetGenericMethodDefinition() == byIdMethod:
                stringList.AddRange(GetPathSegments(call.Arguments[0]));
                var idPathItem = EvaluateExpression(call.Arguments[1]) ?? throw new InvalidOperationException($"Null segment in expression: {expr}");
                if (idPathItem.Contains('/'))
                    throw new InvalidOperationException($"Invalid id '{idPathItem}' in expression: {expr}");
                stringList.Add(idPathItem);
                return stringList;
            case ExpressionType.Convert:
                stringList.AddRange(GetPathSegments(((UnaryExpression)expr).Operand));
                return stringList;
            case ExpressionType.MemberAccess:
                var memberExpression = (MemberExpression)expr;
                stringList.AddRange(GetPathSegments(memberExpression.Expression!));
                stringList.Add(ToCamelCase(memberExpression.Member.Name));
                return stringList;
            case ExpressionType.Parameter:
                return stringList;
            default:
                throw new InvalidOperationException($"Unsupported expression of type {expr.NodeType} in path. Expression: {expr}");
        }
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

    private static string? EvaluateExpression(Expression expression) =>
        Convert.ToString(
            Expression.Lambda<Func<object?, object?>>(
                    Expression.Convert(expression, typeof(object)),
                    Expression.Parameter(typeof(object), null)
                )
                .Compile()(null),
            CultureInfo.InvariantCulture);
}