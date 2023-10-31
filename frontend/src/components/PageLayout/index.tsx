import { Center, Flex, Spinner } from "@chakra-ui/react";
import { ReactNode, Suspense } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => (
  <Flex as="main" flexDir="column">
    <Header mb={9} />
    <Suspense
      fallback={<Center flex={1} children={<Spinner size="lg" />} />}
      children={children}
    />
    <Footer />
  </Flex>
);

export default PageLayout;
