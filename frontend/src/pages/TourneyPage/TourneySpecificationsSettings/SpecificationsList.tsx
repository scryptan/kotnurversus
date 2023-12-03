import { ListProps, OrderedList, Portal } from "@chakra-ui/react";
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
import { v4 as uuid } from "uuid";
import { TourneySpecificationWithId } from "~/types/tourney";
import SpecificationsListBaseItem from "./SpecificationsListItem";

type Props = {
  specifications: TourneySpecificationWithId[];
  onUpdate?: (
    callback: (
      oldSpecifications: TourneySpecificationWithId[]
    ) => TourneySpecificationWithId[]
  ) => void;
} & ListProps;

const SpecificationsList = ({ specifications, onUpdate, ...props }: Props) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getIndex = (id: UniqueIdentifier) => {
    return specifications.findIndex((s) => s.id === id);
  };

  const handleUpdate = (specification: TourneySpecificationWithId) => {
    onUpdate?.((items) =>
      items.map((item) => {
        // update current specification
        if (item.id === specification.id) return specification;

        // update duplicate specification
        if (
          specification.parentId &&
          item.parentId === specification.parentId
        ) {
          return { ...specification, id: item.id };
        }

        return item;
      })
    );
  };

  const handleDuplicate = (id: string) => {
    onUpdate?.((items) =>
      items.flatMap((item) => {
        if (item.id !== id) return [item];
        const parentId = item.parentId || uuid();
        const updated = { ...item, parentId };
        const duplicated = { ...updated, id: uuid() };
        return [updated, duplicated];
      })
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
      <SortableContext
        items={specifications}
        strategy={verticalListSortingStrategy}
      >
        <OrderedList spacing={2} {...props}>
          {specifications.map((specification) => (
            <SpecificationsListItem
              key={specification.id}
              specification={specification}
              onUpdate={handleUpdate}
              onDuplicate={handleDuplicate}
              onRemove={handleRemove}
            />
          ))}
        </OrderedList>
      </SortableContext>
      <Portal>
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <SpecificationsListBaseItem
              isOverlay
              specification={specifications[activeIndex]}
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

type SpecificationsListItemProps = {
  specification: TourneySpecificationWithId;
  onUpdate: (specifications: TourneySpecificationWithId) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: UniqueIdentifier) => void;
};

const SpecificationsListItem = ({
  specification,
  onUpdate,
  onDuplicate,
  onRemove,
}: SpecificationsListItemProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: specification.id });

  return (
    <SpecificationsListBaseItem
      ref={setNodeRef}
      handleRef={setActivatorNodeRef}
      isDragging={isDragging}
      specification={specification}
      onUpdate={onUpdate}
      onDuplicate={() => onDuplicate(specification.id)}
      onRemove={() => onRemove(specification.id)}
      transform={transform}
      transition={transition}
      listeners={listeners}
      {...attributes}
    />
  );
};

export default SpecificationsList;
