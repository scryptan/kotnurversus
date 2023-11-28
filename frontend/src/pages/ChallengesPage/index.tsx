import { Center, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import Loading from "~/components/Loading";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import paths from "~/pages/paths";
import { Challenge } from "~/types/challenge";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";
import CategoryCard from "./CategoryCard";
import CreateCategoryButton from "./CreateCategoryButton";

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
    staleTime: 1000 * 60 * 50,
  });

  const challengesQuery = useQuery({
    queryKey: queryKeys.challenges,
    queryFn: api.challenges.find,
    staleTime: 1000 * 60 * 50,
  });

  if (categoriesQuery.isLoading || challengesQuery.isLoading) {
    return <Loading />;
  }

  if (!categoriesQuery.data || !challengesQuery.data) {
    return (
      <Center py={10}>
        <Heading fontSize="xl">Не удалось загрузить доп. требования</Heading>
      </Center>
    );
  }

  const categories = categoriesQuery.data.items || [];

  if (categories.length === 0) {
    return null;
  }

  const challengesByCategoryId = challengesQuery.data.items.reduce(
    (result, challenge) => {
      if (!result[challenge.categoryId]) {
        result[challenge.categoryId] = [];
      }
      result[challenge.categoryId]?.push(challenge);
      return result;
    },
    {} as Record<string, Challenge[]>
  );

  return (
    <Stack spacing={12}>
      {categories
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            challenges={challengesByCategoryId[category.id] || []}
          />
        ))}
      <CreateCategoryButton />
    </Stack>
  );
};

export default ChallengesPage;
