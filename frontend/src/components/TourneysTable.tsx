import {
  BoxProps,
  Grid,
  GridProps,
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
  tourneys: Tourney[];
} & BoxProps;

const TourneysTable = ({ tourneys, ...props }: Props) => (
  <Stack {...props} spacing={0.5}>
    <HeaderRow mb={2} />
    {tourneys.map((t) => (
      <BodyRow key={t.id} tourney={t} />
    ))}
  </Stack>
);

const HeaderRow = (props: GridProps) => (
  <Grid
    {...props}
    gridTemplateColumns={{ base: "1fr 60px 80px", md: "1fr 150px 200px" }}
    fontSize={{ base: "xs", md: "sm" }}
  >
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
      gridTemplateColumns={{ base: "1fr 60px 80px", md: "1fr 150px 200px" }}
      gridAutoRows={{ base: "50px", md: "64px" }}
      fontSize={{ base: "sm", md: "lg" }}
      bg="blackAlpha.50"
      alignItems="center"
      _hover={{ bg: "blackAlpha.100" }}
      _dark={{
        bg: "whiteAlpha.50",
        _hover: { bg: "whiteAlpha.100" },
      }}
    >
      <BodyCell>{tourney.title}</BodyCell>
      <BodyCell textAlign="center">
        {format(tourney.startDate, "dd.MM")}
      </BodyCell>
      <BodyCell textAlign="center">{TOURNEY_TYPE_NAMES[tourney.form]}</BodyCell>
    </Grid>
  ),
  (prev, next) => prev.tourney.id === next.tourney.id
);

const HeaderCell = (props: TextProps) => <Text color="#909090" {...props} />;

const BodyCell = (props: TextProps) => (
  <Text
    px={{ base: 2, md: 8 }}
    noOfLines={{ base: 2, md: 1 }}
    wordBreak={{ base: "break-word", md: "break-all" }}
    {...props}
  />
);

export default TourneysTable;
