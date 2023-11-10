using Models;

namespace Domain.Services;

public class WriteContext<T, TInvalidDataReason> : WriteContext<T, T, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
{
}

public class WriteContext<TEx, T, TInvalidDataReason> : IWriteContext<TEx, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
    where TEx : T
{
    public List<InvalidData<TInvalidDataReason>> InvalidDatas { get; } = new();

    public bool IsSuccess => InvalidDatas.Count == 0 && !IsEntityTooLarge && !IsForbidden;

    public bool IsEntityTooLarge { get; set; }

    public bool IsForbidden { get; set; }

    public void AddInvalidData(InvalidData<TInvalidDataReason> invalidData)
    {
        InvalidDatas.Add(invalidData);
    }
}