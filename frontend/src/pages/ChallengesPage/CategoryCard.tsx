import { Box, Wrap, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import BaseChallengeCard from "~/components/ChallengeCard";
import ChallengeWindow from "~/components/ChallengeWindow";
import useHandleError from "~/hooks/useHandleError";
import { Category } from "~/types/category";
import { Challenge, CreateChallenge } from "~/types/challenge";
import queryKeys from "~/utils/query-keys";
import CategoryButton from "./CategoryButton";
import CreateChallengeButton from "./CreateChallengeButton";

type Props = {
  category: Category;
  challenges: Challenge[];
};

const CategoryCard = ({ category, challenges }: Props) => (
  <Box>
    <CategoryButton category={category} />
    <Wrap mt={4} spacing={8} align="flex-start">
      {challenges
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            category={category}
            challenge={challenge}
          />
        ))}
      <CreateChallengeButton defaultCategoryId={category.id} />
    </Wrap>
  </Box>
);

type ChallengeCardProps = {
  category: Category;
  challenge: Challenge;
};

const ChallengeCard = ({ category, challenge }: ChallengeCardProps) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const window = useDisclosure();

  const editChallenge = useMutation({
    mutationFn: async (data: CreateChallenge) => {
      return await api.challenges.update(challenge, data);
    },
    onSuccess: async () => {
      window.onClose();
      await queryClient.refetchQueries({ queryKey: queryKeys.challenges() });
    },
    onError: handleError,
  });

  const deleteChallenge = useMutation({
    mutationFn: async () => {
      await api.challenges.delete(challenge.id);
    },
    onSuccess: async () => {
      window.onClose();
      await queryClient.refetchQueries({ queryKey: queryKeys.challenges() });
    },
    onError: handleError,
  });

  return (
    <>
      <BaseChallengeCard
        {...window.getButtonProps()}
        w="160px"
        category={category}
        challenge={challenge}
        onClick={window.onOpen}
      />
      <ChallengeWindow.Edit
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        isLoading={editChallenge.isPending || deleteChallenge.isPending}
        onSubmit={editChallenge.mutateAsync}
        onRemove={deleteChallenge.mutateAsync}
        challenge={challenge}
      />
    </>
  );
};

export default CategoryCard;
