import {
  Box,
  BoxProps,
  Collapse,
  HStack,
  Heading,
  IconButton,
  useBoolean,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ArrowDownIcon from "~/icons/ArrowDownIcon";
import storage from "~/utils/storage";

type Props = {
  heading: string;
  storageKey: string;
  defaultIsOpen: boolean;
} & BoxProps;

const TourneySectionLayout = ({
  heading,
  storageKey,
  defaultIsOpen,
  children,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useBoolean(() =>
    storage.has(storageKey) ? storage.getBoolean(storageKey) : defaultIsOpen
  );

  useEffect(() => {
    storage.set(storageKey, String(isOpen));
  }, [isOpen]);

  return (
    <Box {...props}>
      <Header isOpen={isOpen} onToggle={setIsOpen.toggle} heading={heading} />
      <Collapse in={isOpen} unmountOnExit children={children} />
    </Box>
  );
};

type HeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
  heading: string;
};

const Header = ({ isOpen, onToggle, heading }: HeaderProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <HStack
      w="fit-content"
      cursor="pointer"
      userSelect="none"
      onClick={() => buttonRef.current?.click()}
      transition="opacity 200ms"
      _hover={{ opacity: 0.75 }}
    >
      <Heading fontSize="2xl" fontWeight="medium" children={heading} />
      <IconButton
        ref={buttonRef}
        size="sm"
        variant="unstyled"
        pointerEvents="none"
        onClick={onToggle}
        icon={
          <ArrowDownIcon
            boxSize={6}
            transition="transform 200ms ease-out"
            transform={`rotate(${isOpen ? -180 : 0}deg)`}
          />
        }
        aria-label={`${isOpen ? "Скрыть" : "Показать"} секцию`}
      />
    </HStack>
  );
};

export default TourneySectionLayout;
