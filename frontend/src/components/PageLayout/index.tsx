import { Flex } from "@chakra-ui/react";
import { ReactNode, Suspense } from "react";
import Loading from "~/components/Loading";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => (
  <Flex as="main" flexDir="column">
    <Header mb={9} />
    <Suspense fallback={<Loading flex={1} />} children={children} />
    <Footer />
  </Flex>
);

export default PageLayout;
