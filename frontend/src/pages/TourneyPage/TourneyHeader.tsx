import {
  BoxProps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import BreadcrumbIcon from "~/icons/BreadcrumbIcon";
import paths from "~/pages/paths";
import { TourneyFullInfo } from "~/types/tourney";

type Props = {
  tourney: TourneyFullInfo;
} & BoxProps;

const TourneyHeader = ({ tourney, ...props }: Props) => (
  <Stack spacing={8} {...props}>
    <TourneyBreadcrumb />
    <TourneyInfo px={3} tourney={tourney} />
  </Stack>
);

const TourneyBreadcrumb = () => (
  <Breadcrumb
    spacing={2}
    fontSize="sm"
    color="blackAlpha.800"
    _dark={{ color: "whiteAlpha.800" }}
    separator={<BreadcrumbIcon mb={1} boxSize="9px" />}
  >
    <BreadcrumbItem>
      <BreadcrumbLink as={Link} to={paths.main.path}>
        Главная
      </BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink as={Link} to={paths.tourneys.path}>
        Турниры
      </BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
);

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
        {dayjs(tourney.startDate).format("D MMMM YYYY")}
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
