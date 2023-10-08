import { Center, Flex, Spinner } from "@chakra-ui/react";
import { ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => (
  <Flex as="main">
    <Suspense
      fallback={<Center flex={1} children={<Spinner size="lg" />} />}
      children={children}
    />
  </Flex>
);

export default PageLayout;
