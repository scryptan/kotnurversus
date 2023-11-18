import { OrderedList, Portal } from "@chakra-ui/react";
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { TourneyScenario } from "~/types/tourney";
import ScenariosListBaseItem from "./ScenariosListItem";

type Props = {
  scenarios: TourneyScenario[];
  onUpdate?: (
    callback: (oldScenarios: TourneyScenario[]) => TourneyScenario[]
  ) => void;
};

const ScenariosList = ({ scenarios, onUpdate }: Props) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getIndex = (id: UniqueIdentifier) => {
    return scenarios.findIndex((s) => s.id === id);
  };

  const handleUpdate = (scenario: TourneyScenario) => {
    onUpdate?.((items) =>
      items.map((item) => (item.id === scenario.id ? scenario : item))
    );
  };

  const handleRemove = (id: UniqueIdentifier) => {
    onUpdate?.((items) => items.filter((item) => item.id !== id));
  };

  const activeIndex = activeId ? getIndex(activeId) : -1;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        if (!active) return;
        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);
        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            onUpdate?.((items) => arrayMove(items, activeIndex, overIndex));
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={scenarios} strategy={verticalListSortingStrategy}>
        <OrderedList spacing={2}>
          {scenarios.map((scenario) => (
            <ScenariosListItem
              key={scenario.id}
              scenario={scenario}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </OrderedList>
      </SortableContext>
      <Portal>
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <ScenariosListBaseItem
              isOverlay
              scenario={scenarios[activeIndex]}
            />
          ) : null}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
};

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.25" } },
  }),
};

type ScenariosListItemProps = {
  scenario: TourneyScenario;
  onUpdate: (scenario: TourneyScenario) => void;
  onRemove: (id: UniqueIdentifier) => void;
};

const ScenariosListItem = ({
  scenario,
  onUpdate,
  onRemove,
}: ScenariosListItemProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: scenario.id });

  return (
    <ScenariosListBaseItem
      ref={setNodeRef}
      handleRef={setActivatorNodeRef}
      isDragging={isDragging}
      scenario={scenario}
      onUpdate={onUpdate}
      onRemove={() => onRemove(scenario.id)}
      transform={transform}
      transition={transition}
      listeners={listeners}
      {...attributes}
    />
  );
};

export default ScenariosList;
