import {
  Box,
  BoxProps,
  Collapse,
  HStack,
  Heading,
  IconButton,
  ListItem,
  UnorderedList,
  useBoolean,
} from "@chakra-ui/react";
import { useRef } from "react";
import Link from "~/components/Link";
import ArrowDownIcon from "~/icons/ArrowDownIcon";
import { TourneyArtifact } from "~/types/tourney";

type Props = {
  artifacts: TourneyArtifact[];
};

const TourneyArtifacts = ({ artifacts }: Props) => {
  const [isOpen, setIsOpen] = useBoolean(false);

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <Box>
      <ControlHeader isOpen={isOpen} onToggle={setIsOpen.toggle} />
      <Collapse in={isOpen} unmountOnExit>
        <ArtifactsSection px={2} mt={6} artifacts={artifacts} />
      </Collapse>
    </Box>
  );
};

type ControlHeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const ControlHeader = ({ isOpen, onToggle }: ControlHeaderProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <HStack
      px={4}
      w="fit-content"
      cursor="pointer"
      userSelect="none"
      onClick={() => buttonRef.current?.click()}
      _hover={{ textDecoration: "underline" }}
    >
      <Heading fontSize="3xl">Дополнительные материалы</Heading>
      <IconButton
        ref={buttonRef}
        size="xs"
        variant="unstyled"
        pointerEvents="none"
        onClick={onToggle}
        icon={
          <ArrowDownIcon
            transition="transform 300ms ease-out"
            transform={`rotate(${isOpen ? -180 : 0}deg)`}
          />
        }
        aria-label={`${isOpen ? "Скрыть" : "Показать"} материалы`}
      />
    </HStack>
  );
};

type ArtifactsSectionProps = {
  artifacts: TourneyArtifact[];
} & BoxProps;

const ArtifactsSection = ({ artifacts, ...props }: ArtifactsSectionProps) => (
  <Box {...props}>
    <UnorderedList m={0} fontSize="lg">
      {artifacts.map((a, i) => (
        <ListItem key={i} ml={3}>
          <Link
            isExternal
            href={a.link}
            color="blue.400"
            variant="underline"
            target="_blank"
            children={a.name}
          />
        </ListItem>
      ))}
    </UnorderedList>
  </Box>
);

export default TourneyArtifacts;
