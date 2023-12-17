import { UseBreakpointOptions, useBreakpointValue } from "@chakra-ui/react";

const breakpoints = {
  base: "0em", // 0px
  sm: "30em", // ~480px
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em", // ~1536px
};

type Breakpoint = keyof typeof breakpoints;

const useBreakpoint = <T extends Breakpoint>(
  enabled: T[],
  options: UseBreakpointOptions = {}
) => {
  const breakpoint = useBreakpointValue(
    Object.fromEntries(enabled.map((b) => [b, b])),
    { ssr: false, ...options }
  );

  return breakpoint;
};

export default useBreakpoint;
