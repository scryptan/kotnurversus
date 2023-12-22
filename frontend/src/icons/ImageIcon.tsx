import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2ZM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5Z"
    />
  </Icon>
);
