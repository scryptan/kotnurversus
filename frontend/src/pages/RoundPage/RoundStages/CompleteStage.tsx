import { BoxProps, Button, Center, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import paths from "~/pages/paths";
import { useRoundContext } from "../round-context";
import TeamButton from "./components/TeamButton";

const CompleteStage = () => {
  const { round, getTeams } = useRoundContext();

  const teams = getTeams();
  const winnerTeam = teams.find((t) => t?.id === round.winnerId);

  return (
    <>
      {teams.map((team, i) => (
        <TeamButton key={team?.id || i} gridArea={`t${i + 1}`} team={team} />
      ))}
      <Button
        as={Link}
        gridArea="m"
        justifySelf="center"
        size={{ base: "sm", md: "md" }}
        w="fit-content"
        to={paths.tourney.path(round.gameId)}
        children="Вернуться к турниру"
      />
      {round.participants.slice(0, 2).map((p, i) => (
        <Mark
          key={p.teamId}
          gridArea={`e${i + 1}`}
          justifySelf={{
            base: "center",
            md: i === 0 ? "flex-end" : "flex-start",
          }}
          value={p.points}
          isWinner={p.isWinner}
        />
      ))}
      <Heading
        gridArea="b"
        textAlign="center"
        fontSize={{ base: "xl", md: "2xl" }}
      >
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
    boxSize={{ base: 16, xl: 24 }}
    borderRadius="full"
    fontSize={{ base: "2xl", xl: "4xl" }}
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
