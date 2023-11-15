import {
  Box,
  BoxProps,
  Collapse,
  useBoolean,
  useMergeRefs,
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  ReactElement,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { InputProps } from "~/components/Input";
import Popper from "~/components/Popper";
import useOutsideAction from "~/hooks/useOutsideAction";
import { isDefined } from "~/utils";
import BaseSelect from "../BaseSelect";
import { SelectOption, SelectValue } from "../types";
import SingleSelectInput from "./SingleSelectInput";
import SingleSelectItem from "./SingleSelectItem";

export type SingleSelectProps<T extends SelectValue> = {
  isLoading?: boolean;
  isHideClear?: boolean;
  options: SelectOption<T>[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  optionsHeightInDropdown?: number;
  optionsNumberInDropdown?: number;
  containerProps?: BoxProps;
  NotFoundComponent?: (props: NotFoundProps) => ReactNode;
} & Omit<InputProps, "defaultValue" | "value" | "onChange">;

type NotFoundProps = {
  text: string;
};

const MAX_OPTIONS = 25;

const SingleSelect = <T extends SelectValue>(
  {
    isHideClear,
    options,
    value = null,
    onChange,
    optionsHeightInDropdown = 40,
    optionsNumberInDropdown = 5,
    containerProps,
    NotFoundComponent,
    ...props
  }: SingleSelectProps<T>,
  ref: Ref<HTMLInputElement>
) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useMergeRefs(inputRef, ref);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useBoolean(false);
  const [filteredOptions, setFilteredOptions] = useState(() =>
    options.slice(0, MAX_OPTIONS)
  );

  const { focusIndex, scrollToOption, onKey } = BaseSelect.useLogic({
    inputRef,
    dropdownRef,
    optionsHeightInDropdown,
    optionsNumberInDropdown,
    optionsLength: filteredOptions.length,
  });

  const chosenOption = options.find((o) => o.value === value);

  const handleClose = () => {
    if (!inputRef.current) return;

    if (chosenOption && inputRef.current.value.trim() === "") {
      onChange?.(null);
    } else if (chosenOption) {
      inputRef.current.value = chosenOption.label;
    } else {
      inputRef.current.value = "";
    }

    setIsOpen.off();
    setFilteredOptions(options.slice(0, MAX_OPTIONS));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKey(e, {
      onArrowUp: true,
      onArrowDown: true,
      onEsc: handleClose,
      onEnter: (activeIndex) => {
        if (!isOpen) {
          setIsOpen.on();
          return;
        }

        if (activeIndex > -1 && filteredOptions[activeIndex]) {
          handleOptionChange(filteredOptions[activeIndex]);
        }
      },
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen.on();
    const normalizedValue = e.currentTarget.value.trim().toLowerCase();
    scrollToOption(undefined);
    setFilteredOptions(
      options
        .filter((o) => o.label.toLowerCase().includes(normalizedValue))
        .slice(0, MAX_OPTIONS)
    );
  };

  const handleOptionChange = (option: SelectOption<T>) => {
    if (!inputRef.current) return;
    onChange?.(option.value);
    setIsOpen.off();
    setFilteredOptions(options.slice(0, MAX_OPTIONS));
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    onChange?.(null);
    scrollToOption(undefined);
  };

  useOutsideAction({
    boxRef: boxRef,
    portalRef: dropdownRef,
    callBackOnExit: handleClose,
    isActive: isOpen,
  });

  useEffect(() => {
    if (!isOpen || !chosenOption) return;

    const index = filteredOptions.findIndex(
      (o) => o.value === chosenOption.value
    );
    scrollToOption(index > -1 ? index : undefined);
  }, [isOpen]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = chosenOption?.label || "";
  }, [value]);

  return (
    <Box {...containerProps} ref={boxRef}>
      <SingleSelectInput
        {...props}
        ref={inputRefs}
        isDropdownOpen={isOpen}
        isShowClear={!isHideClear && Boolean(chosenOption)}
        onClear={handleClear}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={setIsOpen.toggle}
      />
      <Popper
        boxShadow="base"
        borderRadius={6}
        isOpen={isOpen && filteredOptions.length !== 0}
        anchorRef={inputRef}
      >
        <BaseSelect.Dropdown
          focusIndex={focusIndex}
          ref={dropdownRef}
          options={filteredOptions}
          chosenValues={isDefined(value) ? [value] : []}
          onChange={handleOptionChange}
          optionsHeightInDropdown={optionsHeightInDropdown}
          maxH={`${optionsNumberInDropdown * optionsHeightInDropdown + 2}px`}
          Item={SingleSelectItem}
        />
      </Popper>

      <Collapse in={filteredOptions.length === 0}>
        {NotFoundComponent && (
          <NotFoundComponent text={inputRef.current?.value || ""} />
        )}
      </Collapse>
    </Box>
  );
};

export default forwardRef(SingleSelect) as <T extends SelectValue>(
  props: SingleSelectProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;
