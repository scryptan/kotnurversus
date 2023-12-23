import { Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import useCustomToast from "~/hooks/useCustomToast";
import useHandleError from "~/hooks/useHandleError";
import OutlinePlusIcon from "~/icons/OutlinePlusIcon";
import declination from "~/utils/declination";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";
import AddImagesWindow from "./AddImagesWindow";

const AddImagesButton = () => {
  const window = useDisclosure();
  const queryClient = useQueryClient();
  const handleError = useHandleError();
  const { round } = useRoundContext();
  const toast = useCustomToast();

  const addImages = useMutation({
    mutationFn: async (newImages: File[]) => {
      const result = await Promise.allSettled(
        newImages.map((image) => api.rounds.addArtifact(round.id, image))
      );
      const loadedCount = result.filter((r) => r.status === "fulfilled").length;
      toast.success({
        description: `Добавлено ${loadedCount} ${declination(
          loadedCount,
          "изображени|е|я|й"
        )}`,
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: queryKeys.round(round.id) });
      window.onClose();
    },
    onError: handleError,
  });

  return (
    <>
      <Stack
        {...window.getButtonProps()}
        as="button"
        spacing={4}
        boxSize="175px"
        align="center"
        justify="center"
        borderRadius={8}
        bg="blackAlpha.50"
        _dark={{ bg: "whiteAlpha.50" }}
        _hover={{ bg: "blackAlpha.100", _dark: { bg: "whiteAlpha.100" } }}
        _focusVisible={{ outline: "none", boxShadow: "outline" }}
        transition="background 200ms ease-out, box-shadow 200ms ease-out"
        onClick={window.onOpen}
      >
        <OutlinePlusIcon boxSize={10} />
        <Text fontSize="lg" lineHeight="150%">
          Добавить изображения
        </Text>
      </Stack>
      <AddImagesWindow
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        isLoading={addImages.isPending}
        onSubmit={addImages.mutateAsync}
      />
    </>
  );
};

export default AddImagesButton;
