import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => children;

export default PageLayout;
