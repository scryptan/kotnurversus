import { Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PenIcon from "~/icons/PenIcon";
import UnlockIcon from "~/icons/UnlockIcon";
import paths from "~/pages/paths";

type Props = {
  tourneyId: number;
};

const TourneyActionButtons = ({ tourneyId }: Props) => {
  return (
    <HStack px={3} spacing={4}>
      <Button
        as={Link}
        to={paths.editTourney.path(tourneyId)}
        rightIcon={<PenIcon boxSize={6} />}
        children="Редактировать турнир"
      />
      <Button
        colorScheme="teal"
        rightIcon={<UnlockIcon boxSize={6} />}
        children="Начать турнир"
      />
    </HStack>
  );
};

export default TourneyActionButtons;
