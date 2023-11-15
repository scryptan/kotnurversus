import { Box, BoxProps, Grid } from "@chakra-ui/react";
import { ReactElement, Ref, forwardRef } from "react";
import { SelectOption, SelectValue } from "../types";
import { DropdownItemProps } from "./SelectDropdownItem";

type Props<T extends SelectValue> = {
  options: SelectOption<T>[];
  chosenValues: T[];
  onChange: (option: SelectOption<T>) => void;
  focusIndex: number;
  optionsHeightInDropdown: number;
  Item: (props: DropdownItemProps<T>) => JSX.Element;
} & Omit<BoxProps, "onChange">;

const SelectDropdown = <T extends SelectValue>(
  {
    options,
    chosenValues,
    onChange,
    focusIndex,
    optionsHeightInDropdown,
    Item,
    ...props
  }: Props<T>,
  ref: Ref<HTMLInputElement>
) => (
  <Grid
    {...props}
    ref={ref}
    pos="relative"
    bg="#F5F5F5"
    border="1px solid"
    borderColor="blackAlpha.100"
    borderRadius="md"
    overflowY="auto"
    gridAutoRows={`${optionsHeightInDropdown}px`}
    visibility={options.length === 0 ? "hidden" : "visible"}
    _dark={{ bg: "#2B2B2B", borderColor: "whiteAlpha.100" }}
  >
    {options.map((option, index) => {
      const isChosen = chosenValues.includes(option.value);
      const onClick = () => onChange(option);
      return (
        <Item
          key={String(option.value)}
          index={index}
          isChosen={isChosen}
          option={option}
          onClick={onClick}
        />
      );
    })}
    {focusIndex >= 0 && options.length !== 0 && (
      <Box
        as="span"
        w="full"
        h={`${optionsHeightInDropdown}px`}
        mt={`${focusIndex * optionsHeightInDropdown}px`}
        pos="absolute"
        zIndex={0}
        opacity={0.5}
        bg="blackAlpha.50"
        pointerEvents="none"
        _dark={{ bg: "whiteAlpha.50" }}
      />
    )}
  </Grid>
);

export default forwardRef(SelectDropdown) as <T extends SelectValue>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;
