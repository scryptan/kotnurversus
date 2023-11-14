import {
  Box,
  ChakraProps,
  forwardRef,
  useBoolean,
  useMergeRefs,
} from "@chakra-ui/react";
import { format, isValid, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Input, { InputProps } from "~/components/Input";
import Popper from "~/components/Popper";
import useOutsideAction from "~/hooks/useOutsideAction";
import CalendarIcon from "~/icons/CalendarIcon";

export type DateInputProps = {
  value?: Date;
  onChange?: (newValue?: Date) => void;
} & Omit<InputProps, "value" | "onChange">;

const DateInput = forwardRef<DateInputProps, "input">(
  ({ value, onChange, ...props }, ref) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefs = useMergeRefs(inputRef, ref);
    const [isOpen, setIsOpen] = useBoolean(false);
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(value);

    useOutsideAction({
      boxRef,
      isActive: isOpen,
      callBackOnExit: setIsOpen.off,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      if (value.length !== 10) return;

      const day = parse(value, "dd.MM.yyyy", new Date());
      const normalizedDay = isValid(day) ? day : undefined;
      setSelectedMonth(normalizedDay);
      onChange?.(normalizedDay);
    };

    const handleSelect: SelectSingleEventHandler = (day) => {
      if (inputRef.current) {
        inputRef.current.value = day ? format(day, "dd.MM.yyyy") : "";
      }
      onChange?.(day);
    };

    return (
      <Box ref={boxRef} {...props.containerProps}>
        <Input
          {...props}
          ref={inputRefs}
          placeholder="дд.мм.гггг"
          onClick={setIsOpen.on}
          onInput={maskDate}
          onChange={handleChange}
          rightElement={<CalendarIcon />}
          rightElementProps={{ pointerEvents: "none" }}
        />
        <Popper
          isOpen={isOpen}
          isSameWidth={false}
          anchorRef={inputRef}
          placement="bottom-start"
          {...dayPickerStyles}
        >
          <DayPicker
            mode="single"
            showOutsideDays
            locale={ru}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            selected={value}
            onSelect={handleSelect}
          />
        </Popper>
      </Box>
    );
  }
);

const maskDate = (e: FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value.replace(/\D/g, "").slice(0, 8);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore в дефолтном типе отсутствует поле
  const offset = e.nativeEvent.inputType === "insertText" ? 1 : 0;
  if (value.length >= 5 - offset) {
    value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
  } else if (value.length >= 3 - offset) {
    value = `${value.slice(0, 2)}.${value.slice(2)}`;
  }
  e.currentTarget.value = value;
};

const dayPickerStyles: ChakraProps = {
  css: {
    ".rdp": {
      margin: "2px",
      padding: "4px 8px",
      background: "#F5F5F5",
      borderRadius: 8,
      boxShadow: "var(--chakra-shadows-base)",
      "--rdp-accent-color": "var(--chakra-colors-secondary)",
      "--rdp-background-color": "var(--chakra-colors-blackAlpha-100)",
      ".rdp-day_today": { borderColor: "var(--chakra-colors-blackAlpha-200)" },
    },
  },
  _dark: {
    ".rdp": {
      background: "#2B2B2B",
      "--rdp-background-color": "var(--chakra-colors-whiteAlpha-100)",
      ".rdp-day_today": { borderColor: "var(--chakra-colors-whiteAlpha-200)" },
    },
  },
};

DateInput.displayName = "Calendar";
export default DateInput;
