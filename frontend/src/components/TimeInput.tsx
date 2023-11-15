import { forwardRef, useMergeRefs } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useRef } from "react";
import Input, { InputProps } from "~/components/Input";
import TimeIcon from "~/icons/TimeIcon";

export type TimeInputProps = {
  value?: string;
  onChange?: (newValue?: string) => void;
} & Omit<InputProps, "value" | "onChange">;

const TimeInput = forwardRef<TimeInputProps, "input">(
  ({ value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefs = useMergeRefs(inputRef, ref);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.value = value || "";
      }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      onChange?.(isValidTime(newValue) ? newValue : undefined);
    };

    return (
      <Input
        {...props}
        ref={inputRefs}
        placeholder="00:00"
        onInput={maskDate}
        onChange={handleChange}
        rightElement={<TimeIcon />}
        rightElementProps={{ pointerEvents: "none" }}
      />
    );
  }
);

const maskDate = (e: FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value.replace(/\D/g, "").slice(0, 4);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore в дефолтном типе отсутствует поле
  const offset = e.nativeEvent.inputType === "insertText" ? 1 : 0;
  if (value.length >= 3 - offset) {
    value = `${value.slice(0, 2)}:${value.slice(2)}`;
  }
  e.currentTarget.value = value;
};

const isValidTime = (time: string): boolean => {
  const regexp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regexp.test(time);
};

export default TimeInput;
