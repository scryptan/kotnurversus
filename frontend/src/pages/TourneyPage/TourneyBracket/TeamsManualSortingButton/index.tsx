import { Button, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import Window, { WindowProps } from "~/components/Window";
import { Team } from "~/types/team";
import TeamsManualSorting from "./TeamsManualSorting";
import MoveIcon from "~/icons/MoveIcon";

type Props = {
  teams: Team[];
  onSubmit: (sortedTeams: Team[]) => void;
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

  const handleChange = (teams: Team[]) => {
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
