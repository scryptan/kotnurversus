import { Center, Heading, Stack } from "@chakra-ui/react";
import Loading from "~/components/Loading";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import useChallengesQuery from "~/hooks/useChallengesQuery";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
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
  const query = useChallengesQuery();

  if (query.isLoading) {
    return <Loading />;
  }

  if (query.isError) {
    return (
      <Center py={10}>
        <Heading fontSize="xl">Не удалось загрузить доп. требования</Heading>
      </Center>
    );
  }

  if (query.categories.length === 0) {
    return null;
  }

  const challengesByCategoryId = query.getChallengesByCategoryId();

  return (
    <Stack spacing={12}>
      {query.categories
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
