import { Button, ButtonProps, Text, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chroma from "chroma-js";
import api from "~/api";
import CategoryWindow from "~/components/CategoryWindow";
import useHandleError from "~/hooks/useHandleError";
import { Category, CreateCategory } from "~/types/category";
import queryKeys from "~/utils/query-keys";

type Props = {
  category: Category;
} & ButtonProps;

const CategoryButton = ({ category, ...props }: Props) => {
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
        minW="100px"
        maxW="300px"
        variant="link"
        color={fontColor}
        bg={category.color}
        border="1px solid"
        borderColor={borderColor}
        whiteSpace="normal"
        onClick={window.onOpen}
        _active={{ textDecoration: "underline" }}
        {...props}
      >
        <Text
          fontSize="xl"
          lineHeight="150%"
          fontWeight="normal"
          noOfLines={1}
          children={category.title}
        />
      </Button>
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
