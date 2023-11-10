using System.Collections.Concurrent;
using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.CompilerServices;
using GrEmit;
using GrEmit.Utils;
using Newtonsoft.Json.Linq;

[assembly: InternalsVisibleTo("Xcom.UnitTests")]

namespace Domain.Helpers;

// ReSharper disable ReturnValueOfPureMethodIsNotUsed
public static class EntityCopier
{
    private static readonly ConcurrentDictionary<(Type, Type, bool), Func<object, object>> copyDelegates = new();

    public static object? Copy(object? source, Type targetType, bool shallow)
    {
        if (source == null)
            return null;

        if (targetType == typeof(object))
            return source;

        var sourceType = source.GetType();
        if (sourceType == targetType || targetType.IsAssignableFrom(sourceType))
            sourceType = targetType;
        else if (!sourceType.IsAssignableFrom(targetType))
            throw new InvalidOperationException($"Either sourceType should inherit targetType or targetType should inherit sourceType. SourceType: {sourceType}; TargetType: {targetType}");

        var copy = copyDelegates.GetOrAdd((sourceType, targetType, shallow), EmitCopy);
        return copy(source);
    }

    public static object? Copy(object? source, bool shallow)
    {
        if (source == null)
            return null;
        return Copy(source, source.GetType(), shallow);
    }

    private static Func<object, object> EmitCopy((Type sourceType, Type targetType, bool shallow) key)
    {
        var (sourceType, targetType, shallow) = key;
        var dynamicMethod = new DynamicMethod(Guid.NewGuid().ToString(), typeof(object), new[] {typeof(object)}, typeof(EntityCopier).Module, skipVisibility: true);
        using (var il = new GroboIL(dynamicMethod))
        {
            il.Ldarg(0); // stack: [arg0]
            if (sourceType.IsValueType)
                il.Unbox_Any(sourceType); // stack: [(sourceType)arg0]
            else
                il.Castclass(sourceType); // stack: [(sourceType)arg0]
            if (shallow)
                EmitShallowCopy(il, sourceType, targetType); // stack: [result]
            else
                EmitCopy(il, sourceType, targetType); // stack: [result]
            if (targetType.IsValueType)
                il.Box(targetType); // stack: [(object)result]
            il.Ret();
        }

        return (Func<object, object>)dynamicMethod.CreateDelegate(typeof(Func<object, object>));
    }

    private static void EmitShallowCopy(GroboIL il, Type sourceType, Type targetType)
    {
        // in-stack: value
        // out-stack: Copy(value)

        if (!IsClass(targetType))
            throw new InvalidOperationException($"Type {targetType} is not supported");

        var isNull = il.DefineLabel("isNull");
        var isCopied = il.DefineLabel("isCopied");
        il.Dup();
        var sourceValue = il.DeclareLocal(sourceType, "sourceValue");
        il.Stloc(sourceValue); // sourceValue = value; stack: [sourceValue]
        il.Brfalse(isNull); // if (sourceValue == null) goto null; stack: []

        il.Newobj(targetType.GetConstructor(Type.EmptyTypes) ?? throw new InvalidOperationException($"Type {targetType} should have default constructor")); // stack: [new targetType()]
        foreach (var prop in sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            // stack: [targetValue]
            il.Dup(); // stack: [targetValue, targetValue] 
            il.Ldloc(sourceValue); // stack: [targetValue, targetValue, sourceValue] 
            il.Call(prop.GetGetMethod()); // stack: [targetValue, targetValue, sourceValue.prop]
            il.Call(prop.GetSetMethod()); // targetValue.prop = Copy(sourceValue.prop); stack: [targetValue]
        }

        il.Br(isCopied); // goto isCopied; stack: [targetValue]

        il.MarkLabel(isNull);
        il.Ldnull(); // stack: [null]
        il.MarkLabel(isCopied);
    }

    private static void EmitCopy(GroboIL il, Type sourceType, Type targetType)
    {
        // in-stack: value
        // out-stack: Copy(value)

        // stack: [value]
        if (IsSimple(targetType))
            return;

        var isTargetTypeAbstract = (targetType.IsAbstract || targetType.IsInterface)
                                   && !typeof(JToken).IsAssignableFrom(targetType);

        if (targetType == typeof(object) || isTargetTypeAbstract)
        {
            il.Ldc_I4(0); // stack: [value, false]
            il.Call(HackHelpers.GetMethodDefinition<object>(x => Copy(x, false))); // stack: [Copy(value, shallow: false)]
            if (isTargetTypeAbstract)
            {
                il.Castclass(targetType);
            }

            return;
        }

        var isNull = il.DefineLabel("isNull");
        var isCopied = il.DefineLabel("isCopied");
        il.Dup();
        var sourceValue = il.DeclareLocal(sourceType, "sourceValue");
        il.Stloc(sourceValue); // sourceValue = value; stack: [sourceValue]
        il.Brfalse(isNull); // if (sourceValue == null) goto null; stack: []

        if (targetType.IsArray)
        {
            var itemType = targetType.GetElementType()!;

            il.Ldloc(sourceValue); // stack: [sourceValue]
            il.Ldlen(); // stack: [sourceValue.Length]
            il.Newarr(itemType); // stack: [new itemType[sourceValue.Length]]
            var targetValue = il.DeclareLocal(targetType, "targetValue");
            il.Dup();
            il.Stloc(targetValue); // targetValue = new itemType[sourceValue.Length]; stack: [targetValue]

            if (IsSimple(itemType))
            {
                // stack: [targetValue]
                il.Ldloc(sourceValue); // stack: [targetValue, sourceValue]
                il.Ldloc(targetValue); // stack: [targetValue, sourceValue, targetValue]
                il.Dup(); // stack: [targetValue, sourceValue, targetValue, targetValue]
                il.Ldlen(); // stack: [targetValue, sourceValue, targetValue, targetValue.Length]
                il.Call(HackHelpers.GetMethodDefinition<int[]>(x => Array.Copy(x, x, 0))); // Array.Copy(sourceValue, targetValue, targetValue.Length); stack: [targetValue]
                il.Br(isCopied); // goto isCopied; stack: [targetValue]
            }
            else
            {
                // stack: [targetValue]
                var i = il.DeclareLocal(typeof(int), "i");
                il.Dup();
                il.Ldlen(); // stack: [targetValue, targetValue.Length]
                il.Stloc(i); // i = targetValue.Length; stack: [targetValue]

                var cycle = il.DefineLabel("cycle");
                il.MarkLabel(cycle);

                il.Ldloc(i); // stack: [targetValue, i]
                il.Brfalse(isCopied); // if (i == 0) goto isCopied; stack: [targetValue]

                il.Dup(); // stack: [targetValue, targetValue]
                il.Ldloc(i); // stack: [targetValue, targetValue, i]
                il.Ldc_I4(1); // stack: [targetValue, targetValue, i, 1]
                il.Sub(); // stack: [targetValue, targetValue, i - 1]
                il.Dup();
                il.Stloc(i); // i = i - 1; stack: [targetValue, targetValue, i]
                il.Ldloc(sourceValue); // stack: [targetValue, targetValue, i, sourceValue]
                il.Ldloc(i); // stack: [targetValue, targetValue, i, sourceValue, i]
                il.Ldelem(itemType); // stack: [targetValue, targetValue, i, sourceValue[i]]
                EmitCopy(il, itemType, itemType); // stack: [targetValue, targetValue, i, Copy(sourceValue[i])]
                il.Stelem(itemType); // targetValue[i] = Copy(sourceValue[i]); stack: [targetValue]

                il.Br(cycle); // goto cycle; stack: [targetValue]
            }
        }
        else if (typeof(JToken).IsAssignableFrom(targetType))
        {
            il.Ldloc(sourceValue); // stack: [sourceValue]
            il.Call(HackHelpers.GetMethodDefinition<JToken>(x => x.DeepClone())); // stack: [sourceValue.DeepClone()]
            if (targetType != typeof(JToken))
                il.Castclass(targetType); // stack: [(targetType)sourceValue.DeepClone()]

            il.Br(isCopied); // goto isCopied; stack: [targetValue]
        }
        else if (IsDictionary(targetType))
        {
            var keyType = targetType.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IDictionary<,>)).GetGenericArguments()[0];
            var valueType = targetType.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IDictionary<,>)).GetGenericArguments()[1];
            var itemType = typeof(KeyValuePair<,>).MakeGenericType(keyType, valueType);

            il.Newobj(targetType.GetConstructor(Type.EmptyTypes)); // stack: [new targetType()]
            var targetValue = il.DeclareLocal(targetType, "targetValue");
            il.Dup();
            il.Stloc(targetValue); // targetValue = new targetType(); stack: [targetValue]

            il.Ldloc(sourceValue); // stack: [targetValue, sourceValue]
            EmitForEach(
                il,
                itemType,
                kvp =>
                {
                    // stack: [targetValue]
                    il.Dup(); // stack: [targetValue, targetValue]
                    il.Castclass(typeof(IDictionary<,>).MakeGenericType(keyType, valueType)); // stack: [targetValue, dictionary]

                    il.Ldloca(kvp); // stack: [targetValue, dictionary, &kvp]
                    il.Call(HackHelpers.GetProp<KeyValuePair<int, int>>(x => x.Key, keyType, valueType).GetGetMethod()); // stack: [targetValue, dictionary, kvp.Key]
                    EmitCopy(il, keyType, keyType); // stack: [targetValue, dictionary, Copy(kvp.Key)]

                    il.Ldloca(kvp); // stack: [targetValue, dictionary, Copy(kvp.Key), &kvp]
                    il.Call(HackHelpers.GetProp<KeyValuePair<int, int>>(x => x.Value, keyType, valueType).GetGetMethod()); // stack: [targetValue, dictionary, Copy(kvp.Key), kvp.Value]
                    EmitCopy(il, valueType, valueType); // stack: [targetValue, dictionary, Copy(kvp.Key), Copy(kvp.Value)]
                    il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IDictionary<int, int>>(x => x.Add(0, 0), new[] {keyType, valueType}, Type.EmptyTypes)); // dictionary.Add(Copy(kvp.Key), Copy(kvp.Value)); stack: [targetValue]
                });

            il.Br(isCopied); // goto isCopied; stack: [targetValue]
        }
        else if (IsCollection(targetType))
        {
            var itemType = targetType.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ICollection<>)).GetGenericArguments()[0];

            il.Newobj(targetType.GetConstructor(Type.EmptyTypes)); // stack: [new targetType()]
            var targetValue = il.DeclareLocal(targetType, "targetValue");
            il.Dup();
            il.Stloc(targetValue); // targetValue = new targetType(); stack: [targetValue]

            il.Ldloc(sourceValue); // stack: [targetValue, sourceValue]
            EmitForEach(
                il,
                itemType,
                item =>
                {
                    // stack: [targetValue]
                    il.Dup(); // stack: [targetValue, targetValue]
                    il.Castclass(typeof(ICollection<>).MakeGenericType(itemType)); // stack: [targetValue, collection]
                    il.Ldloc(item); // stack: [targetValue, collection, item]
                    EmitCopy(il, itemType, itemType); // stack: [targetValue, collection, Copy(item)]
                    il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<ICollection<int>>(x => x.Add(0), new[] {itemType}, Type.EmptyTypes)); // collection.Add(Copy(item)); stack: [targetValue]
                });

            il.Br(isCopied); // goto isCopied; stack: [targetValue] 
        }
        else if (IsClass(targetType))
        {
            il.Newobj(targetType.GetConstructor(Type.EmptyTypes) ?? throw new InvalidOperationException($"Type {targetType} should have default constructor")); // stack: [new targetType()]
            var targetValue = il.DeclareLocal(targetType, "targetValue");
            il.Dup();
            il.Stloc(targetValue); // targetValue = new targetType(); stack: [targetValue]
            foreach (var prop in sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                var setMethod = prop.GetSetMethod();
                if (setMethod == null)
                {
                    continue;
                }

                // stack: [targetValue]
                il.Dup(); // stack: [targetValue, targetValue] 
                il.Ldloc(sourceValue); // stack: [targetValue, targetValue, sourceValue] 
                il.Call(prop.GetGetMethod() ?? throw new InvalidOperationException($"Prop {sourceType.Name}.{prop.Name} has no getter")); // stack: [targetValue, targetValue, sourceValue.prop]

                EmitCopy(il, prop.PropertyType, prop.PropertyType); // stack: [targetValue, targetValue, Copy(sourceValue.prop)]

                il.Call(setMethod); // targetValue.prop = Copy(sourceValue.prop); stack: [targetValue]
            }

            il.Br(isCopied); // goto isCopied; stack: [targetValue]
        }
        else
            throw new InvalidOperationException($"Type {targetType} is not supported");

        il.MarkLabel(isNull);
        il.Ldnull(); // stack: [null]
        il.MarkLabel(isCopied);
    }

    private static bool IsSimple(Type type)
    {
        return type.IsValueType || type == typeof(string);
    }

    private static bool IsDictionary(Type type)
    {
        return type.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IDictionary<,>));
    }

    private static bool IsCollection(Type type)
    {
        return type.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(ICollection<>));
    }

    private static bool IsClass(Type type)
    {
        return type.IsClass && type.Namespace?.StartsWith("System.") == false;
    }

    private static void EmitForEach(GroboIL il, Type itemType, Action<GroboIL.Local> processItem)
    {
        // stack: [enumerable]
        il.Castclass(typeof(IEnumerable<>).MakeGenericType(itemType)); // stack: [(IEnumerable)enumerable]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerable<int>>(x => x.GetEnumerator(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerable.GetEnumerator()]
        var enumerator = il.DeclareLocal(typeof(IEnumerator<>).MakeGenericType(itemType), "enumerator");
        il.Stloc(enumerator); // enumerator = enumerable.GetEnumerator(); stack: []

        var cycle = il.DefineLabel("cycle");
        var cycleDone = il.DefineLabel("cycleDone");
        il.MarkLabel(cycle);

        il.Ldloc(enumerator); // stack: [enumerator]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerator<int>>(x => x.MoveNext(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerator.MoveNext()] 
        il.Brfalse(cycleDone); // if (!enumerator.MoveNext()) goto cycleDone; stack: []

        var item = il.DeclareLocal(itemType, "item");
        il.Ldloc(enumerator); // stack: [enumerator]
        il.Call(HackHelpers.GetProp<IEnumerator<int>>(x => x.Current, itemType).GetGetMethod()); // stack: [enumerator.Current]
        il.Stloc(item); // item = enumerator.Current; stack: []

        processItem(item); // stack: []

        il.Br(cycle); // goto cycle; stack: []

        // stack: []
        il.MarkLabel(cycleDone);
        il.Ldloc(enumerator); // stack: [enumerator]
        il.Call(HackHelpers.GetMethodDefinition<IDisposable>(d => d.Dispose())); // enumerator.Dispose(); stack: []
    }
}