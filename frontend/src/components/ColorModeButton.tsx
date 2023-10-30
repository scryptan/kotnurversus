import { useColorMode } from "@chakra-ui/react";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import LightIcon from "~/icons/LightIcon";
import DarkIcon from "~/icons/DarkIcon";

const ColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const Icon = colorMode === "light" ? DarkIcon : LightIcon;
  const iconColor = colorMode === "light" ? "#AAB3BA" : "#454D54";

  return (
    <IconButtonWithTooltip
      boxSize={10}
      variant="unstyled"
      label="Переключить тему"
      placement="right"
      onClick={toggleColorMode}
      icon={<Icon color={iconColor} boxSize={6} />}
    />
  );
};
export default ColorModeButton;
