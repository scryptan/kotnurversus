import {
  BoxProps,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ReactNode } from "react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { TourneyFullInfo } from "~/types/tourney";

type Props = {
  tourney: TourneyFullInfo;
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
  <SimpleGrid columns={2} gridGap={8} {...props}>
    <Stack spacing={9}>
      <Heading fontSize="4xl">Турнир "{tourney.name}"</Heading>
      <Text fontSize="xl" fontWeight="medium">
        ОРГАНИЗАТОР – {tourney.organizer}
      </Text>
    </Stack>
    <Stack spacing={2} justify="center" justifySelf="flex-end">
      <TourneyInfoRow name="Формат">
        {tourney.type.toLowerCase()}
      </TourneyInfoRow>
      <TourneyInfoRow name="Дата">
        {format(tourney.startDate, "d MMMM yyyy")}
      </TourneyInfoRow>
      <TourneyInfoRow name="Место проведения">
        {tourney.location}
      </TourneyInfoRow>
    </Stack>
  </SimpleGrid>
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
