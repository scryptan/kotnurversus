import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 32 32" {...props}>
    <path
      fill="currentColor"
      d="M16 2.667C8.64 2.667 2.667 8.64 2.667 16S8.64 29.334 16 29.334 29.333 23.36 29.333 16C29.333 8.64 23.36 2.667 16 2.667Zm8 15.96h-6.667l3.014-3.013a6.587 6.587 0 0 0-5.014-2.32c-3.16 0-5.8 2.213-6.48 5.173l-1.28-.427c.854-3.493 4-6.08 7.76-6.08 2.374 0 4.494 1.054 5.96 2.707L24 11.96v6.667Z"
    />
  </Icon>
);
