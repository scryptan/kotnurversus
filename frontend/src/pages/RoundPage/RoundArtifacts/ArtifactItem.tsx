import {
  Box,
  IconButton,
  Image,
  Skeleton,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import api from "~/api";
import Alert from "~/components/Alert";
import useHandleError from "~/hooks/useHandleError";
import CrossIcon from "~/icons/CrossIcon";
import { RoundArtifact } from "~/types/round";
import queryKeys from "~/utils/query-keys";

type Props = {
  roundId: string;
  artifact: RoundArtifact;
  onClick: (artifactId: string) => void;
  isOrganizer?: boolean;
};

const ArtifactItem = ({ roundId, artifact, onClick, isOrganizer }: Props) => {
  const [isLoading, setIsLoading] = useBoolean(true);

  return (
    <Skeleton
      pos="relative"
      borderRadius={4}
      isLoaded={!isLoading}
      _hover={{ button: { opacity: 1 } }}
    >
      <Box
        as="button"
        borderRadius={4}
        onClick={() => onClick(artifact.id)}
        transition="transform 200ms ease-out"
        _hover={{ transform: "scale(0.98)" }}
        _focusVisible={{ outline: "none", boxShadow: "outline" }}
      >
        <Image
          h="240px"
          loading="lazy"
          objectFit="cover"
          borderRadius={4}
          onLoad={setIsLoading.off}
          src={`${import.meta.env.VITE_API_URL}${artifact.content}`}
        />
      </Box>
      {isOrganizer && <DeleteButton roundId={roundId} artifact={artifact} />}
    </Skeleton>
  );
};

const DeleteButton = ({
  roundId,
  artifact,
}: Pick<Props, "roundId" | "artifact">) => {
  const alert = useDisclosure();
  const queryClient = useQueryClient();
  const handleError = useHandleError();

  const deleteArtifact = useMutation({
    mutationFn: async () => {
      await api.rounds.deleteArtifact(roundId, artifact.id);
    },
    onSuccess: async () => {
      alert.onClose();
      await queryClient.refetchQueries({
        queryKey: queryKeys.round(roundId),
      });
    },
    onError: handleError,
  });

  return (
    <>
      <IconButton
        pos="absolute"
        top={-2}
        right={-2}
        size="xs"
        variant="solid"
        colorScheme="red"
        opacity={0}
        borderRadius="full"
        aria-label="Удалить изображение"
        icon={<CrossIcon boxSize={5} />}
        _focusVisible={{ opacity: 1, boxShadow: "outline" }}
        isDisabled={deleteArtifact.isPending}
        onClick={alert.onOpen}
      />
      <Alert
        isOpen={alert.isOpen}
        isLoading={deleteArtifact.isPending}
        onClose={alert.onClose}
        onSubmit={deleteArtifact.mutateAsync}
        children="Вы уверены, что хотите безвозвратно удалить данное изображение?"
      />
    </>
  );
};

export default memo(ArtifactItem, (prev, next) => {
  return (
    prev.isOrganizer === next.isOrganizer &&
    prev.roundId === next.roundId &&
    prev.artifact.id === next.artifact.id
  );
});
