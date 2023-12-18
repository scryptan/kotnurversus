import { Button, ButtonProps } from "@chakra-ui/react";
import ShuffleIcon from "~/icons/ShuffleIcon";
import { TourneyTeam } from "~/types/tourney";

type Props = {
  teams: TourneyTeam[];
  onTeamsChange: (teams: TourneyTeam[]) => void;
} & ButtonProps;

const TeamsShuffleButton = ({ teams, onTeamsChange, ...props }: Props) => {
  const handleClick = async () => {
    const shuffledTeams = teams.toShuffle().map((t, i) => ({ ...t, order: i }));
    onTeamsChange(shuffledTeams);
  };

  return (
    <Button
      {...props}
      leftIcon={<ShuffleIcon boxSize={4} />}
      onClick={handleClick}
      children="Перемешать участников"
    />
  );
};
export default TeamsShuffleButton;
