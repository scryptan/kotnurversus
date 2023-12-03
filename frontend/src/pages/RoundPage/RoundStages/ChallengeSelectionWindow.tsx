import {
  Button,
  Center,
  HStack,
  Heading,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { useMemo, useState } from "react";
import api from "~/api";
import Window, { WindowProps } from "~/components/Window";
import useChallengesQuery from "~/hooks/useChallengesQuery";
import useHandleError from "~/hooks/useHandleError";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";
import { Round } from "~/types/round";
import { TourneyTeam } from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";
import ChallengeWindow from "./ChallengeWindow";

type Props = {
  team?: TourneyTeam;
};

const ChallengeSelectionWindow = ({
  team,
  onClose,
  ...props
}: WindowProps<Props>) => {
  const queryClient = useQueryClient();
  const handleError = useHandleError();
  const { round } = useRoundContext();
  const [chosenChallenge, setChosenChallenge] = useState<Challenge>();

  const query = useChallengesQuery({
    roundId: round.id,
    enabled: props.isOpen,
  });

  const addChallengeMutation = useMutation({
    mutationFn: async (chosenChallengeId: string) => {
      const newParticipants = round.participants.map((p) =>
        p.teamId == team?.id
          ? { ...p, challenges: [...p.challenges, chosenChallengeId] }
          : p
      );
      const operations = compare(
        { participants: round.participants },
        { participants: newParticipants }
      );
      return await api.rounds.patch(round.id, operations);
    },
    onSuccess: (round) => {
      onClose();
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  const { categories, challengesByCategoryId } = useMemo(() => {
    const challengesByCategoryId = query.getChallengesByCategoryId(
      calcAvailableChallenges(round, query.challenges),
      { useShuffle: true }
    );
    const categories = query.categories.filter(
      (c) => challengesByCategoryId[c.id]?.length > 0
    );

    return { categories, challengesByCategoryId };
  }, [props.isOpen, query.isLoading]);

  const handleSubmit = async () => {
    if (!chosenChallenge) return;
    await addChallengeMutation.mutateAsync(chosenChallenge.id);
  };

  const handleClose = () => {
    onClose();
    addChallengeMutation.reset();
    setChosenChallenge(undefined);
  };

  return (
    <>
      <Window
        {...props}
        onClose={handleClose}
        heading={`Команда ${team?.title} выбирает требование`}
        isWindowLoading={query.isLoading}
        isLoading={addChallengeMutation.isPending}
        contentProps={{ w: "600px" }}
        submitProps={{
          isDisabled: chosenChallenge === undefined,
          onClick: handleSubmit,
          children: "Подтвердить",
        }}
      >
        {(query.isError || categories.length < 1) && (
          <Center py={20}>
            <Heading fontSize="lg">
              {query.isError
                ? "Не удалось загрузить доп. требования"
                : "Все доп. требования уже выбраны"}
            </Heading>
          </Center>
        )}
        {categories.length > 0 && (
          <Stack spacing={4}>
            {categories
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  challenges={challengesByCategoryId[category.id]}
                  chosenChallengeId={chosenChallenge?.id}
                  onChoose={setChosenChallenge}
                />
              ))}
          </Stack>
        )}
      </Window>
      <ChallengeWindow
        isOpen={addChallengeMutation.isSuccess}
        onClose={handleClose}
        challenge={chosenChallenge}
        category={query.categories.find(
          (c) => c.id === chosenChallenge?.categoryId
        )}
      />
    </>
  );
};

type CategoryCardProps = {
  category: Category;
  challenges: Challenge[];
  chosenChallengeId?: string;
  onChoose: (challenge: Challenge) => void;
};

const CategoryCard = ({
  category,
  challenges = [],
  chosenChallengeId,
  onChoose,
}: CategoryCardProps) => (
  <HStack
    px={4}
    py={2}
    spacing={8}
    _dark={{ bg: "whiteAlpha.50" }}
    border="2px solid"
    borderColor={category.color}
    borderRadius={8}
  >
    <Text
      flex={1}
      fontSize="md"
      fontWeight="medium"
      children={category.title}
    />
    <Wrap w="164px" spacing={3} justify="flex-end">
      {challenges.map((challenge, i) => {
        const isChosen = chosenChallengeId === challenge.id;
        return (
          <Button
            key={challenge.id}
            gridArea={i}
            size="xs"
            fontSize="md"
            boxSize={8}
            onClick={() => onChoose(challenge)}
            children={i + 1}
            variant={isChosen ? "solid" : "outline"}
            colorScheme={isChosen ? "blue" : "gray"}
          />
        );
      })}
    </Wrap>
  </HStack>
);

const calcAvailableChallenges = (round: Round, challenges: Challenge[]) => {
  const chosenChallengeIds = new Set(
    round.participants.map((p) => p.challenges).flat()
  );
  return challenges.filter(
    (c) =>
      (round.settings.catsInTheBag || !c.isCatInBag) &&
      !chosenChallengeIds.has(c.id)
  );
};

export default ChallengeSelectionWindow;
