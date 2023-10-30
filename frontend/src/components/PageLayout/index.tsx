import { Center, Flex, Spinner } from "@chakra-ui/react";
import { ReactNode, Suspense } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => (
  <Flex as="main" flexDir="column">
    <Header />
    <Suspense
      fallback={<Center flex={1} children={<Spinner size="lg" />} />}
      children={children}
    />
  </Flex>
);

export default PageLayout;
