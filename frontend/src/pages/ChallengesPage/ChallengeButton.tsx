import { Button, ButtonProps, Text, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import ChallengeWindow from "~/components/ChallengeWindow";
import useHandleError from "~/hooks/useHandleError";
import { Challenge, CreateChallenge } from "~/types/challenge";
import queryKeys from "~/utils/query-keys";

type Props = {
  challenge: Challenge;
} & ButtonProps;

const ChallengeButton = ({ challenge: challenge, ...props }: Props) => {
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
      <Button
        {...window.getButtonProps()}
        minW="100px"
        maxW="300px"
        variant="link"
        whiteSpace="normal"
        onClick={window.onOpen}
        _active={{ textDecoration: "underline" }}
        {...props}
      >
        <Text
          color="text.light.main"
          fontSize="lg"
          lineHeight="150%"
          fontWeight="normal"
          noOfLines={1}
          children={challenge.title}
          _dark={{ color: "text.dark.main" }}
        />
      </Button>
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

export default ChallengeButton;
