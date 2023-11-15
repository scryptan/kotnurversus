import {
  Box,
  Grid,
  GridProps,
  Heading,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { memo } from "react";
import Link from "~/components/Link";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { TOURNEY_TYPE_NAMES } from "~/utils/tourney";

type Props = {
  title: string;
  tourneys: Tourney[];
};

const TourneysTable = ({ title, tourneys }: Props) => (
  <Box>
    <Heading fontSize="xl" textTransform="uppercase" textAlign="center">
      {title}
    </Heading>
    <Stack mt={4} spacing={0.5}>
      <HeaderRow mb={2} />
      {tourneys.map((t) => (
        <BodyRow key={t.id} tourney={t} />
      ))}
    </Stack>
  </Box>
);

const HeaderRow = (props: GridProps) => (
  <Grid {...props} gridTemplateColumns="1fr 150px 200px" fontSize="sm">
    <HeaderCell>Турнир</HeaderCell>
    <HeaderCell textAlign="center">Дата</HeaderCell>
    <HeaderCell textAlign="center">Тип</HeaderCell>
  </Grid>
);

type BodyRowProps = {
  tourney: Tourney;
};

const BodyRow = memo(
  ({ tourney }: BodyRowProps) => (
    <Grid
      as={Link}
      href={paths.tourney.path(tourney.id)}
      gridTemplateColumns="1fr 150px 200px"
      gridAutoRows="64px"
      fontSize="lg"
      bg="blackAlpha.50"
      alignItems="center"
      _hover={{ bg: "blackAlpha.100" }}
      _dark={{
        bg: "whiteAlpha.50",
        _hover: { bg: "whiteAlpha.100" },
      }}
    >
      <BodyCell>{tourney.name}</BodyCell>
      <BodyCell textAlign="center">
        {format(tourney.startDate, "dd.MM")}
      </BodyCell>
      <BodyCell textAlign="center">{TOURNEY_TYPE_NAMES[tourney.type]}</BodyCell>
    </Grid>
  ),
  (prev, next) => prev.tourney.id === next.tourney.id
);

const HeaderCell = (props: TextProps) => <Text color="#909090" {...props} />;

const BodyCell = (props: TextProps) => (
  <Text px={8} noOfLines={1} wordBreak="break-all" {...props} />
);

export default TourneysTable;
