import { Button, useBoolean, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import Window, { WindowProps } from "~/components/Window";
import MoveIcon from "~/icons/MoveIcon";
import { TourneyTeam } from "~/types/tourney";
import TeamsManualSorting from "./TeamsManualSorting";

type Props = {
  teams: TourneyTeam[];
  onSubmit: (sortedTeams: TourneyTeam[]) => Promise<void>;
};

const TeamsManualSortingButton = ({ teams, onSubmit }: Props) => {
  const window = useDisclosure();

  return (
    <>
      <Button
        {...window.getButtonProps()}
        onClick={window.onOpen}
        leftIcon={<MoveIcon />}
        children="Сопоставить участников"
      />
      <TeamsManualSortingWindow
        {...window.getDisclosureProps()}
        teams={teams}
        isOpen={window.isOpen}
        onClose={window.onClose}
        onSubmit={onSubmit}
      />
    </>
  );
};

const TeamsManualSortingWindow = ({
  teams,
  onSubmit,
  ...props
}: WindowProps<Props>) => {
  const sortedTeams = useRef(teams);
  const [isLoading, setIsLoading] = useBoolean(false);

  const handleChange = (teams: TourneyTeam[]) => {
    sortedTeams.current = teams;
  };

  const handleSubmit = async () => {
    setIsLoading.on();
    try {
      await onSubmit(sortedTeams.current.map((t, i) => ({ ...t, order: i })));
      props.onClose();
    } finally {
      setIsLoading.off();
    }
  };

  return (
    <Window
      heading="Сопоставление участников"
      isLoading={isLoading}
      submitProps={{ onClick: handleSubmit }}
      {...props}
    >
      <TeamsManualSorting teams={teams} onChange={handleChange} />
    </Window>
  );
};

export default TeamsManualSortingButton;
