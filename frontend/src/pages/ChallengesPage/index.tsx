import {
  Button,
  ButtonProps,
  Center,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import CategoryCard from "~/components/CategoryCard";
import CategoryWindow from "~/components/CategoryWindow";
import Loading from "~/components/Loading";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import useHandleError from "~/hooks/useHandleError";
import paths from "~/pages/paths";
import { CreateCategory } from "~/types/category";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

const ChallengesPage = () => {
  const { isAuthenticated } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  if (!isAuthenticated) {
    return <Loading flex={1} />;
  }

  return (
    <Stack
      px={2}
      py={7}
      mx="auto"
      w="full"
      maxW="wrapper"
      flex={1}
      spacing={10}
    >
      <Heading textAlign="center">Дополнительные требования</Heading>
      <ChallengeSection />
    </Stack>
  );
};

const ChallengeSection = () => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.categories.find,
  });

  const challengesQuery = useQuery({
    queryKey: queryKeys.challenges,
    queryFn: api.challenges.find,
  });

  if (categoriesQuery.isLoading || challengesQuery.isLoading) {
    return <Loading />;
  }

  if (!categoriesQuery.data && !challengesQuery.data) {
    return (
      <Center py={10}>
        <Heading fontSize="xl">Не удалось загрузить доп. требования</Heading>
      </Center>
    );
  }

  const categories = categoriesQuery.data?.items || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <Stack spacing={12}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} challenges={[]} />
      ))}
      <CreateCategoryButton />
    </Stack>
  );
};

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

export default ChallengesPage;
