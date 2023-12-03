import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M8.823 8a1.553 1.553 0 0 1-.456 1.102l-5.606 5.606a1.039 1.039 0 0 1-1.469-1.47l5.135-5.134a.147.147 0 0 0 0-.208L1.292 2.761a1.039 1.039 0 0 1 1.47-1.469l5.605 5.606A1.553 1.553 0 0 1 8.823 8Z"
    />
    <path
      fill="currentColor"
      d="M14.796 8a1.554 1.554 0 0 1-.456 1.102l-5.606 5.606a1.039 1.039 0 0 1-1.468-1.47L12.4 8.105a.147.147 0 0 0 0-.208L7.266 2.761a1.039 1.039 0 0 1 1.468-1.469l5.606 5.606A1.554 1.554 0 0 1 14.796 8Z"
    />
  </Icon>
);
