using Models;

namespace Domain.Services;

public interface IWriteContext<T, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
{
    bool IsSuccess { get; }
    bool IsEntityTooLarge { get; set; }
    bool IsForbidden { get; set; }
    void AddInvalidData(InvalidData<TInvalidDataReason> invalidData);
}