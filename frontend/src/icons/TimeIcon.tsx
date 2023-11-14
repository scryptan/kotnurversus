import { Icon, IconProps } from "@chakra-ui/react";

export default (props: IconProps) => (
  <Icon boxSize={4} fill="none" viewBox="0 0 24 24" {...props}>
    <g fill="currentColor" clip-path="url(#clip0_1923_10248)">
      <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
      <path d="M17.134 15.81 12.5 11.561V6.5a1 1 0 0 0-2 0V12a1 1 0 0 0 .324.738l4.959 4.545a1.01 1.01 0 0 0 1.413-.061 1 1 0 0 0-.062-1.412Z" />
    </g>
    <defs>
      <clipPath id="clip0_1923_10248">
        <path fill="currentColor" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </Icon>
);
