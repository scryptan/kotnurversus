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
  label: string;
  storageKey?: string;
  defaultIsOpen?: boolean;
  headerProps?: BoxProps;
} & BoxProps;

const CollapsibleSection = ({
  label,
  storageKey,
  defaultIsOpen = true,
  headerProps,
  children,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useBoolean(() =>
    storageKey && storage.has(storageKey, { isSession: true })
      ? storage.getBoolean(storageKey, { isSession: true })
      : defaultIsOpen
  );

  useEffect(() => {
    if (!storageKey) return;
    storage.set(storageKey, String(isOpen), { isSession: true });
  }, [isOpen, storageKey]);

  return (
    <Box {...props}>
      <CollapsibleHeader
        label={label}
        isOpen={isOpen}
        onToggle={setIsOpen.toggle}
        {...headerProps}
      />
      <Collapse in={isOpen} unmountOnExit children={children} />
    </Box>
  );
};

type CollapsibleHeaderProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
} & BoxProps;

const CollapsibleHeader = ({
  label,
  isOpen,
  onToggle,
  ...props
}: CollapsibleHeaderProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <HStack
      w="fit-content"
      cursor="pointer"
      userSelect="none"
      transition="opacity 200ms"
      _hover={{ opacity: 0.75 }}
      onClick={() => buttonRef.current?.click()}
      {...props}
    >
      <Heading
        fontSize={{ base: "md", md: "2xl" }}
        fontWeight="medium"
        children={label}
      />
      <IconButton
        ref={buttonRef}
        size="sm"
        variant="unstyled"
        pointerEvents="none"
        onClick={onToggle}
        icon={
          <ArrowDownIcon
            boxSize={{ base: 5, md: 6 }}
            transition="transform 200ms ease-out"
            transform={`rotate(${isOpen ? -180 : 0}deg)`}
          />
        }
        aria-label={`${isOpen ? "Скрыть" : "Показать"} раздел`}
      />
    </HStack>
  );
};

export default CollapsibleSection;
