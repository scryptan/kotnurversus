import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

type Props = {
  isExternal?: boolean;
} & LinkProps;

const Link = ({ isExternal, href, ...props }: Props) => (
  <ChakraLink
    as={isExternal ? ChakraLink : ReactLink}
    href={isExternal ? href : undefined}
    to={isExternal ? undefined : href}
    {...props}
  />
);

export default Link;
