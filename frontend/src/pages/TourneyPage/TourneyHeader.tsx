import {
  BoxProps,
  Grid,
  Heading,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ReactNode } from "react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { TOURNEY_TYPE_NAMES } from "~/utils/tourney";

type Props = {
  tourney: Tourney;
} & BoxProps;

const TourneyHeader = ({ tourney, ...props }: Props) => (
  <Stack spacing={8} {...props}>
    <Breadcrumb items={breadcrumbItems} />
    <TourneyInfo px={3} tourney={tourney} />
  </Stack>
);

const breadcrumbItems = [
  { name: "Главная", link: paths.main.path },
  { name: "Турниры", link: paths.tourneys.path },
];

const TourneyInfo = ({ tourney, ...props }: Props) => (
  <Grid gridTemplateColumns="1.5fr 1fr" gridGap={8} {...props}>
    <Stack spacing={9}>
      <Heading fontSize="4xl">Турнир "{tourney.title}"</Heading>
    </Stack>
    <Stack spacing={2} justify="center">
      <TourneyInfoRow name="Формат">
        {TOURNEY_TYPE_NAMES[tourney.form]?.toLowerCase() || "неизвестно"}
      </TourneyInfoRow>
      <TourneyInfoRow name="Дата">
        {format(tourney.startDate, "d MMMM yyyy HH:mm")}
      </TourneyInfoRow>
      {tourney.description && (
        <TourneyInfoRow name="Описание" children={tourney.description} />
      )}
    </Stack>
  </Grid>
);

type TourneyInfoRowProps = {
  name: string;
  children: ReactNode;
};

const TourneyInfoRow = ({ name, children }: TourneyInfoRowProps) => {
  const { colorMode } = useColorMode();

  return (
    <Text wordBreak="break-word">
      <Text as="span" color={`text.${colorMode}.extra.1`}>
        {name}:
      </Text>{" "}
      {children}
    </Text>
  );
};

export default TourneyHeader;
