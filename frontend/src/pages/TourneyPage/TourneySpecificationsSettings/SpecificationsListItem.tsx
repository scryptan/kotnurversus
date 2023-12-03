import {
  Button,
  ButtonProps,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { Transform } from "@dnd-kit/utilities";
import React, { forwardRef, memo } from "react";
import IconButtonWithTooltip from "~/components/IconButtonWithTooltip";
import SpecificationWindow from "~/components/SpecificationWindow";
import DragHandleIcon from "~/icons/DragHandleIcon";
import DuplicateIcon from "~/icons/DuplicateIcon";
import { TourneySpecificationWithId } from "~/types/tourney";

type Props = {
  handleRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  onUpdate?: (specification: TourneySpecificationWithId) => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  specification: TourneySpecificationWithId;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
};

const SpecificationsListItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      isDragging,
      isOverlay,
      handleRef,
      specification,
      onUpdate,
      onDuplicate,
      onRemove,
      transform,
      listeners,
      transition,
    },
    ref
  ) => {
    const window = useDisclosure();

    const styles = {
      transition,
      "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
      "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
      "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
      "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
    } as React.CSSProperties;

    return (
      <HStack
        ref={ref}
        listStyleType={isOverlay ? "none" : undefined}
        opacity={isDragging ? 0.25 : 1}
        transform={transformProperty}
        style={styles}
        _hover={{ button: { opacity: 1 } }}
      >
        <HandleButton
          ref={handleRef}
          cursor={isOverlay ? "grabbing" : "grab"}
          {...listeners}
        />
        <Text ml={6} as="li" fontSize="lg">
          <Button
            {...window.getButtonProps()}
            maxW="50vw"
            variant="link"
            color="text.light.main"
            _dark={{ color: "text.dark.main" }}
            fontSize="lg"
            fontWeight="normal"
            whiteSpace="normal"
            textAlign="start"
            justifyContent="flex-start"
            onClick={window.onOpen}
            children={specification.title}
          />
        </Text>
        {onDuplicate && <DuplicateButton onClick={onDuplicate} />}
        {onUpdate && (
          <SpecificationWindow.Edit
            {...window.getDisclosureProps()}
            isOpen={window.isOpen}
            onClose={window.onClose}
            specification={specification}
            onSubmit={onUpdate}
            onRemove={onRemove}
          />
        )}
      </HStack>
    );
  }
);

const HandleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <IconButton
      ref={ref}
      size="sm"
      variant="ghost"
      opacity={0}
      icon={<DragHandleIcon />}
      aria-label="Перетащить"
      _focusVisible={{ opacity: 1, boxShadow: "outline" }}
      {...props}
    />
  )
);

const DuplicateButton = (props: ButtonProps) => (
  <IconButtonWithTooltip
    size="sm"
    variant="ghost"
    opacity={0}
    placement="right"
    label="Дублировать"
    icon={<DuplicateIcon boxSize={5} />}
    _focusVisible={{ opacity: 1, boxShadow: "outline" }}
    {...props}
  />
);

const transformProperty = [
  "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)",
  "scaleX(var(--scale-x, 1))",
  "scaleY(var(--scale-y, 1))",
].join(" ");

export default memo(SpecificationsListItem);
