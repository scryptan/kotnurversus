import { useColorMode } from "@chakra-ui/react";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import LightIcon from "~/icons/LightIcon";
import DarkIcon from "~/icons/DarkIcon";

const ColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const Icon = colorMode === "light" ? DarkIcon : LightIcon;

  return (
    <IconButtonWithTooltip
      boxSize={10}
      variant="unstyled"
      label="Переключить тему"
      placement="right"
      onClick={toggleColorMode}
      icon={<Icon color="#AAB3BA" boxSize={{ base: 5, md: 6 }} />}
    />
  );
};

export default ColorModeButton;
