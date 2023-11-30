import { Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import RoundHeader from "./RoundHeader";
import RoundSpecificationSection from "./RoundSpecificationSection";
import RoundStages from "./RoundStages";
import RoundStateSection from "./RoundStateSection";
import { RoundProvider } from "./round-context";

type PageParams = {
  roundId: string;
};

const RoundPage = () => {
  const { roundId = "" } = useParams<PageParams>();

  return (
    <RoundProvider roundId={roundId}>
      <Stack
        px={2}
        pb={20}
        mx="auto"
        w="full"
        maxW="wrapper"
        flex={1}
        spacing={8}
      >
        <RoundHeader />
        <RoundStateSection />
        <RoundStages />
        <RoundSpecificationSection />
      </Stack>
    </RoundProvider>
  );
};

export default RoundPage;
