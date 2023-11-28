import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chroma from "chroma-js";
import api from "~/api";
import CategoryWindow from "~/components/CategoryWindow";
import useHandleError from "~/hooks/useHandleError";
import { Category, CreateCategory } from "~/types/category";
import queryKeys from "~/utils/query-keys";

type Props = {
  category: Category;
};

const CategoryButton = ({
  category,
  ...props
}: Pick<Props, "category"> & ButtonProps) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const window = useDisclosure();

  const editCategory = useMutation({
    mutationFn: async (data: CreateCategory) => {
      return await api.categories.update(category, data);
    },
    onSuccess: async () => {
      window.onClose();
      await queryClient.refetchQueries({ queryKey: queryKeys.categories });
    },
    onError: handleError,
  });

  const deleteCategory = useMutation({
    mutationFn: async () => {
      await api.categories.delete(category.id);
    },
    onSuccess: async () => {
      window.onClose();
      await queryClient.refetchQueries({ queryKey: queryKeys.categories });
    },
    onError: handleError,
  });

  const fontColor =
    chroma(category.color).luminance() < 0.5 ? "white" : "text.light.main";

  const borderColor = chroma(category.color).darken().hex();

  return (
    <>
      <Button
        {...window.getButtonProps()}
        px={2}
        variant="link"
        borderRadius={6}
        color={fontColor}
        bg={category.color}
        border="1px solid"
        borderColor={borderColor}
        fontSize="xl"
        lineHeight="150%"
        fontWeight="normal"
        whiteSpace="normal"
        justifyContent="flex-start"
        onClick={window.onOpen}
        children={category.title}
        _active={{ textDecoration: "underline" }}
        {...props}
      />
      <CategoryWindow.Edit
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        isLoading={editCategory.isPending || deleteCategory.isPending}
        onSubmit={editCategory.mutateAsync}
        onRemove={deleteCategory.mutateAsync}
        category={category}
      />
    </>
  );
};

export default CategoryButton;
