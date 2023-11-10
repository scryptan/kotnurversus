import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 32 32" {...props}>
    <path
      fill="currentColor"
      d="M16 2.667C8.64 2.667 2.667 8.64 2.667 16S8.64 29.334 16 29.334 29.333 23.36 29.333 16C29.333 8.64 23.36 2.667 16 2.667Zm-1.333 18.667H12V10.667h2.667v10.667Zm5.333 0h-2.667V10.667H20v10.667Z"
    />
  </Icon>
);
