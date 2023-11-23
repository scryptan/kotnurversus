import { Button, ButtonProps, useBoolean } from "@chakra-ui/react";
import ShuffleIcon from "~/icons/ShuffleIcon";
import { TourneyTeam } from "~/types/tourney";

type Props = {
  teams: TourneyTeam[];
  onTeamsChange: (teams: TourneyTeam[]) => Promise<void>;
} & ButtonProps;

const TeamsShuffleButton = ({ teams, onTeamsChange, ...props }: Props) => {
  const [isLoading, setIsLoading] = useBoolean(false);

  const handleClick = async () => {
    setIsLoading.on();
    try {
      const shuffledTeams = teams
        .toShuffle()
        .map((t, i) => ({ ...t, order: i }));
      await onTeamsChange(shuffledTeams);
    } finally {
      setIsLoading.off();
    }
  };

  return (
    <Button
      {...props}
      isLoading={isLoading}
      leftIcon={<ShuffleIcon boxSize={4} />}
      onClick={handleClick}
      children="Перемещать участников"
    />
  );
};
export default TeamsShuffleButton;
