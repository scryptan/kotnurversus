import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M23.432 10.524C20.787 7.614 16.4 4.538 12 4.6 7.6 4.537 3.213 7.615.568 10.524a2.211 2.211 0 0 0 0 2.948c2.614 2.879 6.939 5.928 11.27 5.928h.309c4.347 0 8.67-3.049 11.288-5.929a2.21 2.21 0 0 0-.003-2.947ZM7.4 12a4.6 4.6 0 1 1 9.2 0 4.6 4.6 0 0 1-9.2 0Z"
    />
    <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </Icon>
);
