import { Heading, Stack } from "@chakra-ui/react";
import BaseTourneysTable from "~/components/TourneysTable";
import { Tourney } from "~/types/tourney";

type Props = {
  title: string;
  tourneys: Tourney[];
};

const TourneysTable = ({ title, tourneys }: Props) => (
  <Stack spacing={4}>
    <Heading fontSize="xl" textTransform="uppercase" textAlign="center">
      {title}
    </Heading>
    <BaseTourneysTable tourneys={tourneys} />
  </Stack>
);

export default TourneysTable;
