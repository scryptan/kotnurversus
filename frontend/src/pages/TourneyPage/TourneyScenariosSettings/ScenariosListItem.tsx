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
import ScenarioWindow from "~/components/ScenarioWindow";
import DragHandleIcon from "~/icons/DragHandleIcon";
import { TourneyScenario } from "~/types/tourney";

type Props = {
  handleRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  onUpdate?: (scenario: TourneyScenario) => void;
  onRemove?: () => void;
  scenario: TourneyScenario;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
};

const ScenariosListItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      isDragging,
      isOverlay,
      handleRef,
      scenario,
      onUpdate,
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
            minW="200px"
            variant="link"
            color="text.light.main"
            _dark={{ color: "text.dark.main" }}
            fontSize="lg"
            fontWeight="normal"
            justifyContent="flex-start"
            onClick={window.onOpen}
            children={scenario.name}
          />
        </Text>
        {onUpdate && (
          <ScenarioWindow.Edit
            {...window.getDisclosureProps()}
            isOpen={window.isOpen}
            onClose={window.onClose}
            scenario={scenario}
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
      aria-label="Кнопка для перетаскивания"
      {...props}
    />
  )
);

const transformProperty = [
  "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)",
  "scaleX(var(--scale-x, 1))",
  "scaleY(var(--scale-y, 1))",
].join(" ");

export default memo(ScenariosListItem);
