import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M10.571 10.571V2h2.858v8.571H22v2.858h-8.571V22H10.57v-8.571H2V10.57h8.571Z"
    />
  </Icon>
);
