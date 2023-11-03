import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 6 10" {...props}>
    <path
      fill="currentColor"
      d="M1.058.5 0 1.558 3.435 5 0 8.443 1.058 9.5l4.5-4.5-4.5-4.5Z"
    />
  </Icon>
);
