import { Button, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import Window, { WindowProps } from "~/components/Window";
import TeamsManualSorting from "./TeamsManualSorting";
import MoveIcon from "~/icons/MoveIcon";
import { TourneyTeam } from "~/types/tourney";

type Props = {
  teams: TourneyTeam[];
  onSubmit: (sortedTeams: TourneyTeam[]) => void;
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

  const handleChange = (teams: TourneyTeam[]) => {
    sortedTeams.current = teams;
  };

  const handleSubmit = () => {
    onSubmit(sortedTeams.current);
    props.onClose();
  };

  return (
    <Window
      heading="Сопоставление участников"
      submitProps={{ onClick: handleSubmit }}
      {...props}
    >
      <TeamsManualSorting teams={teams} onChange={handleChange} />
    </Window>
  );
};

export default TeamsManualSortingButton;
