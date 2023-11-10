using System.Collections.Concurrent;
using System.Reflection;
using System.Reflection.Emit;
using GrEmit;
using GrEmit.Utils;
using Newtonsoft.Json.Linq;

namespace Domain.Helpers;

// ReSharper disable EqualExpressionComparison
// ReSharper disable ReturnValueOfPureMethodIsNotUsed
public static class EntityComparer
{
    private static readonly ConcurrentDictionary<Type, Func<object?, object?, bool>> equalsDelegates = new ConcurrentDictionary<Type, Func<object?, object?, bool>>();

    public static bool EntityEquals(object? a, object? b, Type type)
    {
        if (a == null && b == null)
            return true;
        if (a == null || b == null)
            return false;
        var equals = equalsDelegates.GetOrAdd(type, EmitEquals);
        return equals(a, b);
    }

    public static bool EntityEquals(object? a, object? b)
    {
        if (a == null && b == null)
            return true;
        if (a == null || b == null)
            return false;
        var aType = a.GetType();
        var bType = b.GetType();
        if (aType != bType)
            return false;
        var equals = equalsDelegates.GetOrAdd(aType, EmitEquals);
        return equals(a, b);
    }

    private static Func<object?, object?, bool> EmitEquals(Type type)
    {
        var dynamicMethod = new DynamicMethod(Guid.NewGuid().ToString(), typeof(bool), new[] {typeof(object), typeof(object)}, typeof(EntityCopier).Module, skipVisibility: true);
        using (var il = new GroboIL(dynamicMethod))
        {
            il.Ldarg(0); // stack: [a]
            if (type.IsValueType)
                il.Unbox_Any(type); // stack: [(targetType)a]
            else
                il.Castclass(type); // stack: [(targetType)a]
            il.Ldarg(1); // stack: [b]
            if (type.IsValueType)
                il.Unbox_Any(type); // stack: [(targetType)b]
            else
                il.Castclass(type); // stack: [(targetType)b]
            EmitEquals(il, type, null, null); // stack: [a == b]
            il.Ret();
        }

        return (Func<object?, object?, bool>)dynamicMethod.CreateDelegate(typeof(Func<object?, object?, bool>));
    }

    private static void EmitEquals(GroboIL il, Type type, GroboIL.Local? a, GroboIL.Local? b)
    {
        // in-stack: [a, b]
        // out-stack: [a == b]

        if (type.IsPrimitive)
        {
            // stack: [a, b]
            il.Ceq(); // stack: [a == b]
            return;
        }

        var isTypeAbstract = (type.IsAbstract || type.IsInterface)
                             && !typeof(JToken).IsAssignableFrom(type);

        if (type == typeof(object) || isTypeAbstract)
        {
            // stack: [a, b]
            il.Call(HackHelpers.GetMethodDefinition<object>(x => EntityEquals(x, x))); // stack: [EntityEquals(a, b)]
            return;
        }

        if (typeof(JToken).IsAssignableFrom(type))
        {
            // stack: [a, b]
            il.Call(HackHelpers.GetMethodDefinition<JToken>(x => JToken.DeepEquals(x, x))); // stack: [JToken.DeepEquals(a, b)]
            return;
        }

        // stack: [a, b]
        if (b == null)
        {
            b = il.DeclareLocal(type, "b");
            il.Stloc(b);
        }
        else
            il.Pop();

        if (a == null)
        {
            a = il.DeclareLocal(type, "a");
            il.Stloc(a);
        }
        else
            il.Pop();

        // stack: []
        if (type.IsValueType)
        {
            il.Ldloc(a); // stack: [a]
            il.Box(type); // stack: [(object)a]
            il.Ldloc(b); // stack: [(object)a, b]
            il.Box(type); // stack: [(object)a, (object)b]
            il.Call(HackHelpers.GetMethodDefinition<object>(x => Equals(x, x))); // stack: [object.Equals(a, b)]
            return;
        }

        // stack: []
        il.Ldloc(a); // stack: [a] 
        il.Ldloc(b); // stack: [a, b]
        il.Ceq(); // stack: [ReferenceEquals(a, b)]
        var equals = il.DefineLabel("equals");
        var notEquals = il.DefineLabel("notEquals");
        var done = il.DefineLabel("done");
        il.Brtrue(equals); // if (ReferenceEquals(a, b)) goto equals; stack: []

        il.Ldloc(a); // stack: [a]
        il.Brfalse(notEquals); // if (a == null) goto notEquals; stack: []

        il.Ldloc(b); // stack: [b]
        il.Brfalse(notEquals); // if (b == null) goto notEquals; stack: []

        var equatableType = type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IEquatable<>) && x.GetGenericArguments()[0] == type);
        var dictionaryType = type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IDictionary<,>));
        var setType = type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ISet<>));
        var collectionType = type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ICollection<>));

        if (equatableType != null)
        {
            il.Ldloc(a); // stack: [a]
            il.Castclass(equatableType); // stack: [(IEquatable<type>)a]
            il.Ldloc(b); // stack: [(IEquatable<type>)a, b]
            il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEquatable<int>>(x => x.Equals(x), new[] {type}, Type.EmptyTypes)); // stack: [(IEquatable<type>)a.Equals(b)]
            il.Br(done);
        }
        else if (type.IsArray)
        {
            var itemType = type.GetElementType()!;
            il.Ldloc(a); // stack: [a]
            il.Ldlen(); // stack: [a.Length]
            il.Ldloc(b); // stack: [a.Length, b]
            il.Ldlen(); // stack: [a.Length, b.Length]
            il.Ceq(); // stack: [a.Length == b.Length]
            il.Brfalse(notEquals); // if (a.Length != b.Length) goto notEquals; stack: []

            // stack: []
            var i = il.DeclareLocal(typeof(int), "i");
            il.Ldloc(a); // stack: [a]
            il.Ldlen(); // stack: [a.Length]
            il.Stloc(i); // i = a.Length; stack: []

            var cycle = il.DefineLabel("cycle");
            il.MarkLabel(cycle);

            il.Ldloc(i); // stack: [i]
            il.Brfalse(equals); // if (i == 0) goto equals; stack: []

            il.Ldloc(a); // stack: [a]
            il.Ldloc(i); // stack: [a, i]
            il.Ldc_I4(1); // stack: [a, i, 1]
            il.Sub(); // stack: [a, i - 1]
            il.Dup();
            il.Stloc(i); // i = i - 1; stack: [a, i]
            il.Ldelem(itemType); // stack: [a[i]]
            il.Ldloc(b); // stack: [a[i], b]
            il.Ldloc(i); // stack: [a[i], b, i]
            il.Ldelem(itemType); // stack: [a[i], b[i]]
            EmitEquals(il, itemType, null, null); // stack: [a[i] == b[i]]
            il.Brfalse(notEquals); // if (a[i] != b[i]) goto notEquals; stack: []

            il.Br(cycle); // goto cycle; stack: [targetValue]
        }
        else if (dictionaryType != null)
        {
            var keyType = dictionaryType.GetGenericArguments()[0];
            var valueType = dictionaryType.GetGenericArguments()[1];
            var itemType = typeof(KeyValuePair<,>).MakeGenericType(keyType, valueType);

            il.Ldloc(a); // stack: [a]
            il.Castclass(collectionType); // stack: [(ICollection<itemType>)a]
            il.Call(HackHelpers.GetProp<ICollection<int>>(x => x.Count, itemType).GetGetMethod()); // stack: [a.Count]
            il.Ldloc(b); // stack: [a.Count, b]
            il.Castclass(collectionType); // stack: [a.Count, (ICollection<itemType>)b]
            il.Call(HackHelpers.GetProp<ICollection<int>>(x => x.Count, itemType).GetGetMethod()); // stack: [a.Count, b.Count]
            il.Ceq(); // stack: [a.Count == b.Count]
            il.Brfalse(notEquals); // if (a.Count != b.Count) goto notEquals; stack: []

            il.Ldloc(a); // stack: [a]
            var bValue = il.DeclareLocal(valueType, "b_value");
            EmitForEach(
                il,
                itemType,
                (kvp, breakLabel) =>
                {
                    il.Ldloc(b);
                    il.Castclass(dictionaryType); // stack: [(IDictionary<keyType, valueType>)b]
                    il.Ldloca(kvp); // stack: [(IDictionary<keyType, valueType>)b, &kvp]
                    il.Call(HackHelpers.GetProp<KeyValuePair<int, int>>(x => x.Key, keyType, valueType).GetGetMethod()); // stack: [(IDictionary<keyType, valueType>)b, kvp.Key]
                    il.Ldloca(bValue); // stack: [(IDictionary<keyType, valueType>)b, kvp.Key, out bValue]
                    int dummy;
                    il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IDictionary<int, int>>(d => d.TryGetValue(0, out dummy), new[] {keyType, valueType}, Type.EmptyTypes)); // stack: [b.TryGetValue(kvp.Key, out bValue)] 
                    il.Brfalse(breakLabel); // if (!b.TryGetValue(kvp.Key, out bValue)) goto breakLabel; stack: []

                    il.Ldloca(kvp); // stack: [&kvp]
                    il.Call(HackHelpers.GetProp<KeyValuePair<int, int>>(x => x.Value, keyType, valueType).GetGetMethod()); // stack: [kvp.Value]
                    il.Ldloc(bValue); // stack: [kvp.Value, bValue]
                    EmitEquals(il, valueType, null, bValue); // stack: [kvp.Value == bValue] 
                    il.Brfalse(breakLabel); // if (kvp.Value != bValue) goto breakLabel; stack: []
                }); // stack: [allItemsProcessed => equals]
            il.Br(done);
        }
        else if (setType != null)
        {
            var itemType = setType.GetGenericArguments()[0];
            il.Ldloc(a); // stack: [a]
            il.Castclass(setType); // stack: [(ISet<itemType>)a]
            il.Ldloc(b); // stack: [(ISet<itemType>)a, b]
            il.Castclass(typeof(IEnumerable<>).MakeGenericType(itemType)); // stack: [(ISet<itemType>)a, (IEnumerable<itemType>)b]
            il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<ISet<int>>(s => s.SetEquals(s), new[] {itemType}, Type.EmptyTypes)); // stack: [a.SetEquals(b)]
            il.Br(done);
        }
        else if (collectionType != null)
        {
            var itemType = collectionType.GetGenericArguments()[0];
            il.Ldloc(a); // stack: [a]
            il.Castclass(collectionType); // stack: [(ICollection<itemType>)a]
            il.Call(HackHelpers.GetProp<ICollection<int>>(x => x.Count, itemType).GetGetMethod()); // stack: [a.Count]
            il.Ldloc(b); // stack: [a.Count, b]
            il.Castclass(collectionType); // stack: [a.Count, (ICollection<itemType>)b]
            il.Call(HackHelpers.GetProp<ICollection<int>>(x => x.Count, itemType).GetGetMethod()); // stack: [a.Count, b.Count]
            il.Ceq(); // stack: [a.Count == b.Count]
            il.Brfalse(notEquals); // if (a.Count != b.Count) goto notEquals; stack: []

            il.Ldloc(a); // stack: [a]
            il.Ldloc(b); // stack: [a, b]
            EmitForEach2(
                il,
                itemType,
                (item1, item2, breakLabel) =>
                {
                    // stack: []
                    il.Ldloc(item1); // stack: [item1]
                    il.Ldloc(item2); // stack: [item1, item2]
                    EmitEquals(il, itemType, item1, item2); // stack: [item1 == item2]
                    il.Brfalse(breakLabel); // if (item1 != item2) goto breakLabel; stack: []
                });
            // stack: [a == b]
            il.Br(done);
        }
        else if (IsClass(type))
        {
            foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                // stack: []
                il.Ldloc(a); // stack: [a] 
                il.Call(prop.GetGetMethod()); // stack: [a.prop]
                il.Ldloc(b); // stack: [a.prop, b] 
                il.Call(prop.GetGetMethod()); // stack: [a.prop, b.prop]
                EmitEquals(il, prop.PropertyType, null, null); // stack: [a.prop == b.prop]
                il.Brfalse(notEquals); // if (a.prop != b.prop) goto notEquals; stack: []
            }

            il.Br(equals); // goto equals; stack: []
        }
        else
            throw new InvalidOperationException($"Type {type} is not supported");

        // stack: []
        il.MarkLabel(notEquals);
        il.Ldc_I4(0); // stack: [false]
        il.Br(done);

        // stack: [] 
        il.MarkLabel(equals);
        il.Ldc_I4(1); // stack: [true]
        il.MarkLabel(done);
    }

    private static bool IsClass(Type type)
    {
        return type.IsClass && type.Namespace?.StartsWith("System.") == false;
    }

    private static void EmitForEach(GroboIL il, Type itemType, Action<GroboIL.Local, GroboIL.Label> processItem)
    {
        // stack: [enumerable]
        il.Castclass(typeof(IEnumerable<>).MakeGenericType(itemType)); // stack: [(IEnumerable)enumerable]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerable<int>>(x => x.GetEnumerator(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerable.GetEnumerator()]
        var enumerator = il.DeclareLocal(typeof(IEnumerator<>).MakeGenericType(itemType), "enumerator");
        il.Stloc(enumerator); // enumerator = enumerable.GetEnumerator(); stack: []

        var cycle = il.DefineLabel("cycle");
        var done = il.DefineLabel("done");
        var cycleDone = il.DefineLabel("cycleDone");
        var cycleBreak = il.DefineLabel("cycleBreak");
        il.MarkLabel(cycle);

        il.Ldloc(enumerator); // stack: [enumerator]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerator<int>>(x => x.MoveNext(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerator.MoveNext()] 
        il.Brfalse(cycleDone); // if (!enumerator.MoveNext()) goto cycleDone; stack: []

        var item = il.DeclareLocal(itemType, "item");
        il.Ldloc(enumerator); // stack: [enumerator]
        il.Call(HackHelpers.GetProp<IEnumerator<int>>(x => x.Current, itemType).GetGetMethod()); // stack: [enumerator.Current]
        il.Stloc(item); // item = enumerator.Current; stack: []

        processItem(item, cycleBreak); // stack: []

        il.Br(cycle); // goto cycle; stack: []

        // stack: []
        il.MarkLabel(cycleBreak);
        il.Ldc_I4(0); // stack: [false]
        il.Br(done);

        // stack: []
        il.MarkLabel(cycleDone);
        il.Ldc_I4(1); // stack: [true]

        // stack: [allItemsProcessed]
        il.MarkLabel(done);
        il.Ldloc(enumerator); // stack: [allItemsProcessed, enumerator]
        il.Call(HackHelpers.GetMethodDefinition<IDisposable>(d => d.Dispose())); // enumerator.Dispose(); stack: [allItemsProcessed]
    }

    private static void EmitForEach2(GroboIL il, Type itemType, Action<GroboIL.Local, GroboIL.Local, GroboIL.Label> emitItemsAreEqual)
    {
        // stack: [a, b]
        il.Castclass(typeof(IEnumerable<>).MakeGenericType(itemType)); // stack: [a, (IEnumerable)b]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerable<int>>(x => x.GetEnumerator(), new[] {itemType}, Type.EmptyTypes)); // stack: [a, b.GetEnumerator()]
        var enumerator2 = il.DeclareLocal(typeof(IEnumerator<>).MakeGenericType(itemType), "enumerator_b");
        il.Stloc(enumerator2); // enumerator2 = b.GetEnumerator(); stack: [a]

        il.Castclass(typeof(IEnumerable<>).MakeGenericType(itemType)); // stack: [(IEnumerable)a]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerable<int>>(x => x.GetEnumerator(), new[] {itemType}, Type.EmptyTypes)); // stack: [a.GetEnumerator()]
        var enumerator1 = il.DeclareLocal(typeof(IEnumerator<>).MakeGenericType(itemType), "enumerator_a");
        il.Stloc(enumerator1); // enumerator1 = a.GetEnumerator(); stack: []

        var cycle = il.DefineLabel("cycle");
        var done = il.DefineLabel("done");
        var cycleDone = il.DefineLabel("cycleDone");
        var cycleBreak = il.DefineLabel("cycleBreak");
        il.MarkLabel(cycle);

        il.Ldloc(enumerator1); // stack: [enumerator1]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerator<int>>(x => x.MoveNext(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerator1.MoveNext()] 
        il.Brfalse(cycleDone); // if (!enumerator1.MoveNext()) goto cycleDone; stack: []

        il.Ldloc(enumerator2); // stack: [enumerator2]
        il.Call(HackHelpers.ConstructGenericMethodDefinitionForGenericClass<IEnumerator<int>>(x => x.MoveNext(), new[] {itemType}, Type.EmptyTypes)); // stack: [enumerator2.MoveNext()] 
        il.Brfalse(cycleDone); // if (!enumerator2.MoveNext()) goto cycleDone; stack: []

        var item1 = il.DeclareLocal(itemType, "item_a");
        il.Ldloc(enumerator1); // stack: [enumerator1]
        il.Call(HackHelpers.GetProp<IEnumerator<int>>(x => x.Current, itemType).GetGetMethod()); // stack: [enumerator1.Current]
        il.Stloc(item1); // item1 = enumerator1.Current; stack: []

        var item2 = il.DeclareLocal(itemType, "item_b");
        il.Ldloc(enumerator2); // stack: [enumerator2]
        il.Call(HackHelpers.GetProp<IEnumerator<int>>(x => x.Current, itemType).GetGetMethod()); // stack: [enumerator2.Current]
        il.Stloc(item2); // item2 = enumerator2.Current; stack: []

        emitItemsAreEqual(item1, item2, cycleBreak); // stack: []

        il.Br(cycle); // goto cycle; stack: []

        // stack: []
        il.MarkLabel(cycleBreak);
        il.Ldc_I4(0); // stack: [false]
        il.Br(done);

        // stack: []
        il.MarkLabel(cycleDone);
        il.Ldc_I4(1); // stack: [true]

        // stack: [allItemsProcessed]
        il.MarkLabel(done);
        il.Ldloc(enumerator1); // stack: [allItemsProcessed, enumerator1]
        il.Call(HackHelpers.GetMethodDefinition<IDisposable>(d => d.Dispose())); // enumerator1.Dispose(); stack: [allItemsProcessed]
        il.Ldloc(enumerator1); // stack: [allItemsProcessed, enumerator1]
        il.Call(HackHelpers.GetMethodDefinition<IDisposable>(d => d.Dispose())); // enumerator1.Dispose(); stack: [allItemsProcessed]
    }
}