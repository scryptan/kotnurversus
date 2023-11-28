import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import CategoryWindow from "~/components/CategoryWindow";
import useHandleError from "~/hooks/useHandleError";
import { CreateCategory } from "~/types/category";
import queryKeys from "~/utils/query-keys";

const CreateCategoryButton = (props: ButtonProps) => {
  const window = useDisclosure();
  const queryClient = useQueryClient();
  const handleError = useHandleError();

  const createCategory = useMutation({
    mutationFn: async (data: CreateCategory) => {
      return await api.categories.create(data);
    },
    onSuccess: async () => {
      window.onClose();
      await queryClient.refetchQueries({ queryKey: queryKeys.categories });
    },
    onError: handleError,
  });

  return (
    <>
      <Button
        {...props}
        {...window.getButtonProps()}
        w="fit-content"
        variant="link"
        colorScheme="blue"
        fontWeight="normal"
        children="Создать категорию"
      />
      <CategoryWindow.Create
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        isLoading={createCategory.isPending}
        onSubmit={createCategory.mutateAsync}
      />
    </>
  );
};

export default CreateCategoryButton;
