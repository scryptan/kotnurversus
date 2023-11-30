import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import TeamCard from "~/components/TeamCard";
import { TourneyTeam } from "~/types/tourney";
import { useRoundContext } from "../round-context";
import ChallengeSelectionWindow from "./ChallengeSelectionWindow";

const PrepareStage = () => {
  const { getTeams } = useRoundContext();
  const [teamA, teamB] = getTeams();
  const [currentTeam, setCurrentTeam] = useState<TourneyTeam>();

  const handleChoose = (team: TourneyTeam) => () => setCurrentTeam(team);

  return (
    <>
      {teamA && (
        <TeamCard.Button
          gridArea="teamA"
          justifySelf="flex-end"
          activeColor="#D83161"
          team={teamA}
          onClick={handleChoose(teamA)}
        />
      )}
      <Center gridArea="main">
        <Text
          textAlign="center"
          fontSize="2xl"
          lineHeight="150%"
          textTransform="uppercase"
        >
          Выбор <br />
          дополнительных <br />
          требований
        </Text>
      </Center>
      {teamB && (
        <TeamCard.Button
          gridArea="teamB"
          activeColor="#D83161"
          team={teamB}
          onClick={handleChoose(teamB)}
        />
      )}
      <Stack align="center" gridArea="control">
        <Text textAlign="center" fontSize="md" lineHeight="150%">
          Нажмите на команду, которая будет выбирать
          <br />
          Когда будете готовы - нажмите кнопку ниже
        </Text>
        <Button colorScheme="teal" children="Запустить таймер" />
      </Stack>
      <ChallengeSelectionWindow
        isOpen={currentTeam !== undefined}
        onClose={() => setCurrentTeam(undefined)}
        team={currentTeam}
      />
    </>
  );
};

export default PrepareStage;
