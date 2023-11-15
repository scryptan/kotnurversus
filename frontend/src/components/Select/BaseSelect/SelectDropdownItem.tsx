import { Flex, FlexProps } from "@chakra-ui/react";
import { SelectOption, SelectValue } from "../types";

export type DropdownItemProps<T extends SelectValue> = {
  index: number;
  isChosen: boolean;
  option: SelectOption<T>;
} & FlexProps;

const SelectDropdownItem = <T extends SelectValue>({
  isChosen,
  option,
  ...props
}: DropdownItemProps<T>) => (
  <Flex
    px={4}
    zIndex={1}
    boxSize="full"
    align="center"
    bg={isChosen ? "blackAlpha.100" : "transparent"}
    _hover={{
      bg: "blackAlpha.50",
      cursor: "pointer",
      _dark: { bg: "whiteAlpha.50" },
    }}
    _notLast={{
      borderBottom: "1px solid",
      borderColor: "blackAlpha.50",
      _dark: { borderColor: "whiteAlpha.50" },
    }}
    _dark={{ bg: isChosen ? "whiteAlpha.100" : "transparent" }}
    children={option.label}
    {...props}
  />
);

export default SelectDropdownItem;
