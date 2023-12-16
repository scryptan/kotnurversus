import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import RoundHeader from "./RoundHeader";
import RoundSpecificationSection from "./RoundSpecificationSection";
import RoundStages from "./RoundStages";
import { RoundProvider } from "./round-context";

type PageParams = {
  roundId: string;
};

const RoundPage = () => {
  const { roundId = "" } = useParams<PageParams>();

  return (
    <RoundProvider roundId={roundId}>
      <Flex
        px={2}
        pb={20}
        mx="auto"
        w="full"
        maxW="wrapper"
        flex={1}
        flexDir="column"
      >
        <RoundHeader />
        <RoundStages mt={5} />
        <RoundSpecificationSection mt={{ base: 10, md: 20 }} />
      </Flex>
    </RoundProvider>
  );
};

export default RoundPage;
