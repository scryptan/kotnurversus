import {
  BoxProps,
  Button,
  Center,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import TeamCard from "~/components/TeamCard";
import paths from "~/pages/paths";
import { useRoundContext } from "../round-context";

const CompleteStage = () => {
  const { round, getTeams } = useRoundContext();

  const teams = getTeams();
  const winnerTeam = teams.find((t) => t?.id === round.winnerId);

  return (
    <>
      {teams.map((team, i) => {
        if (!team) return null;
        return (
          <TeamCard.Base key={team.id} gridArea={`t${i + 1}`} team={team} />
        );
      })}
      <Stack gridArea="main" alignSelf="center" align="center">
        <Text fontSize="2xl" lineHeight="150%" textTransform="uppercase">
          Завершено
        </Text>
        <Button
          as={Link}
          w="fit-content"
          to={paths.tourney.path(round.gameId)}
          children="Вернуться к турниру"
        />
      </Stack>
      {round.participants.slice(0, 2).map((p, i) => (
        <Mark
          key={p.teamId}
          gridArea={`e${i + 1}`}
          justifySelf="center"
          value={p.points}
          isWinner={p.isWinner}
        />
      ))}
      <Heading gridArea="b" textAlign="center" fontSize="4xl" lineHeight="150%">
        Победа команды
        <br />"{winnerTeam?.title || "???"}"
      </Heading>
    </>
  );
};

type MarkProps = {
  value: number;
  isWinner?: boolean;
} & BoxProps;

const Mark = ({ value, isWinner, ...props }: MarkProps) => (
  <Center
    {...props}
    boxSize={24}
    borderRadius="full"
    fontSize="4xl"
    fontWeight="bold"
    border="2px solid"
    bg="blackAlpha.50"
    borderColor="blackAlpha.50"
    boxShadow={isWinner ? "0px 0px 20px 0px #2BC02B" : "none"}
    _dark={{ bg: "whiteAlpha.50", borderColor: "whiteAlpha.50" }}
    children={value}
  />
);

export default CompleteStage;