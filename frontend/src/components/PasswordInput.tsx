import { forwardRef, useBoolean } from "@chakra-ui/react";
import EyeClose from "~/icons/EyeClose";
import EyeOpen from "~/icons/EyeOpen";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import Input, { InputProps } from "./Input";

const PasswordInput = forwardRef<InputProps, "input">((props, ref) => {
  const [isShowPassword, setIsShowPassword] = useBoolean(false);

  const label = isShowPassword ? "Скрыть пароль" : "Показать пароль";
  const Icon = isShowPassword ? EyeClose : EyeOpen;

  return (
    <Input
      ref={ref}
      {...props}
      type={isShowPassword ? "text" : "password"}
      rightElement={
        <IconButtonWithTooltip
          placement="right"
          size="sm"
          variant="outline"
          border="none"
          tabIndex={-1}
          label={label}
          icon={<Icon boxSize={props.size === "lg" ? 6 : 5} />}
          onClick={setIsShowPassword.toggle}
        />
      }
    />
  );
});

export default PasswordInput;
