import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import TeamCard from "~/components/TeamCard";
import { TourneyTeam } from "~/types/tourney";

type CardProps = {
  roundId: string;
  teamA?: TourneyTeam;
  teamB?: TourneyTeam;
};

const PrepareStage = ({ roundId: _, teamA, teamB }: CardProps) => {
  const [chosenTeamId, setChosenTeamId] = useState<string>();

  return (
    <>
      {teamA && (
        <TeamCard.Button
          gridArea="teamA"
          activeColor="#D83161"
          team={teamA}
          isChosen={teamA.id === chosenTeamId}
          onChoose={setChosenTeamId}
          justifySelf="flex-end"
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
          isChosen={teamB.id === chosenTeamId}
          onChoose={setChosenTeamId}
        />
      )}
      <Stack align="center" gridArea="control">
        <Text textAlign="center" fontSize="md" lineHeight="150%">
          Нажмите на команду, которая будет выбирать
          <br />
          Когда будете готовы - нажмите кнопку ниже
        </Text>
        <Button
          isDisabled={!chosenTeamId}
          colorScheme="teal"
          children="Запустить таймер"
        />
      </Stack>
    </>
  );
};

export default PrepareStage;
