import {
  forwardRef,
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from "@chakra-ui/react";

export type IconButtonWithTooltipProps = {
  label: string;
  placement?: TooltipProps["placement"];
} & Omit<IconButtonProps, "aria-label">;

const IconButtonWithTooltip = forwardRef<IconButtonWithTooltipProps, "button">(
  ({ label, placement = "top", isDisabled, isLoading, ...props }, ref) => (
    <Tooltip
      hasArrow
      closeOnClick={false}
      label={label}
      openDelay={500}
      placement={placement}
      isDisabled={isDisabled || isLoading}
    >
      <IconButton
        ref={ref}
        aria-label={label}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  )
);

export default IconButtonWithTooltip;
