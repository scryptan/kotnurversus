import {
  Button,
  ButtonProps,
  Center,
  Grid,
  Portal,
  Text,
} from "@chakra-ui/react";
import {
  DndContext,
  DragOverlay,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
  useDndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS, Transform } from "@dnd-kit/utilities";
import React, {
  Fragment,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { TourneyTeam } from "~/types/tourney";
import { isDefined } from "~/utils";

type Props = {
  teams: TourneyTeam[];
  onChange?: (sortedTeams: TourneyTeam[]) => void;
};

const TeamsManualSorting = ({ teams, onChange }: Props) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [sortedTeamIds, setSortedTeamIds] = useState<UniqueIdentifier[]>(
    teams.map((t) => t.id)
  );

  useEffect(() => {
    const teamsMap = new Map(teams.map((t) => [t.id, t]));
    const sortedTeams = sortedTeamIds
      .map((id) => teamsMap.get(`${id}`))
      .filter(isDefined);
    onChange?.(sortedTeams);
  }, [sortedTeamIds]);

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={({ over, active }) => {
        if (over !== null) {
          const index = over.id as number;
          const teamId = active.id;
          const updated = [...sortedTeamIds];
          const prevIndex = sortedTeamIds.findIndex((id) => id === teamId);
          if (prevIndex !== -1) {
            updated[prevIndex] = sortedTeamIds[index];
          }
          updated[index] = teamId;
          setSortedTeamIds(updated);
        }
        setActiveId(null);
      }}
    >
      <Grid gridTemplateColumns="225px 50px 225px" gridGap={4}>
        {sortedTeamIds.map((teamId, index) => {
          const team = teams.find((team) => team.id === teamId);

          return (
            <Fragment key={index}>
              <Droppable id={index}>
                <DraggableItem team={team} />
              </Droppable>
              {index % 2 === 0 ? (
                <Center fontSize="xl" fontWeight="bold" children="VS" />
              ) : null}
            </Fragment>
          );
        })}
      </Grid>
      <DraggableOverlay
        team={activeId ? teams.find((t) => t.id === activeId) : undefined}
      />
    </DndContext>
  );
};

type DroppableProps = {
  id: UniqueIdentifier;
  children: ReactNode;
};

const Droppable = ({ id, children }: DroppableProps) => {
  const { setNodeRef } = useDroppable({ id });

  return <Center w="full" h="50px" ref={setNodeRef} children={children} />;
};

type DraggableItemProps = {
  team?: TourneyTeam;
};

const DraggableItem = ({ team }: DraggableItemProps) => {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: team?.id || "unknown",
  });

  if (!team) return null;

  return (
    <Draggable
      team={team}
      ref={setNodeRef}
      listeners={listeners}
      opacity={isDragging ? 0.25 : undefined}
    />
  );
};

const DraggableOverlay = ({ team }: DraggableItemProps) => {
  const { active } = useDndContext();

  return (
    <Portal appendToParentPortal>
      <DragOverlay zIndex={1500} dropAnimation={dropAnimationConfig}>
        {active && team ? <Draggable isOverlay team={team} /> : null}
      </DragOverlay>
    </Portal>
  );
};

const dropAnimationConfig: DropAnimation = {
  keyframes: ({ transform }) => [
    { transform: CSS.Transform.toString(transform.initial) },
    {
      transform: CSS.Transform.toString({
        ...transform.final,
        scaleX: 0.95,
        scaleY: 0.95,
      }),
    },
  ],
};

type DraggableProps = {
  team: TourneyTeam;
  isOverlay?: boolean;
  listeners?: DraggableSyntheticListeners;
  transform?: Transform | null;
} & ButtonProps;

export const Draggable = forwardRef<HTMLButtonElement, DraggableProps>(
  ({ team, isOverlay, listeners, transform, ...props }, ref) => {
    const styles = {
      "--translate-x": `${transform?.x || 0}px`,
      "--translate-y": `${transform?.y || 0}px`,
    } as React.CSSProperties;

    const overlayStyles = {
      cursor: "grabbing",
      _dark: { bg: "#464646" },
    };

    return (
      <Button
        {...props}
        {...listeners}
        ref={ref}
        w="full"
        transition="none"
        transform="translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)"
        style={styles}
        {...(isOverlay ? overlayStyles : {})}
      >
        <Text noOfLines={1} wordBreak="break-all" children={team.title} />
      </Button>
    );
  }
);

export default TeamsManualSorting;
