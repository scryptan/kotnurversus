import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M22 10H2v4h20v-4Z" />
  </Icon>
);
