import { ReactNode } from "react";
import Linkify from "react-linkify";
import Link from "~/components/Link";

type Props = {
  children: ReactNode;
};

const AutoLinkWrapper = ({ children }: Props) => (
  <Linkify
    children={children}
    componentDecorator={(href, decoratedText, key) => (
      <Link
        key={key}
        isExternal
        href={href}
        target="_blank"
        children={decoratedText}
        textDecoration="underline"
        _hover={{ opacity: 0.75, textDecoration: "underline" }}
      />
    )}
  />
);

export default AutoLinkWrapper;
