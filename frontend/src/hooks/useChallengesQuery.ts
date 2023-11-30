import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { Challenge } from "~/types/challenge";
import queryKeys from "~/utils/query-keys";

type UseChallengesQueryParams = {
  enabled?: boolean;
};

const useChallengesQuery = ({ enabled }: UseChallengesQueryParams = {}) => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.categories.find,
    staleTime: 1000 * 60 * 50,
    enabled,
  });

  const challengesQuery = useQuery({
    queryKey: queryKeys.challenges,
    queryFn: api.challenges.find,
    staleTime: 1000 * 60 * 50,
    enabled,
  });

  const getChallengesByCategoryId = (
    challenges: Challenge[] = challengesQuery.data?.items || [],
    options: { useShuffle?: boolean } = {}
  ): Record<string, Challenge[]> =>
    challenges.reduce(
      (result, challenge) => {
        let byCategory = result[challenge.categoryId];
        if (!byCategory) {
          result[challenge.categoryId] = [];
          byCategory = result[challenge.categoryId];
        }
        byCategory.push(challenge);
        if (options.useShuffle) {
          result[challenge.categoryId] = byCategory.toShuffle();
        }
        return result;
      },
      {} as Record<string, Challenge[]>
    );

  return {
    categories: categoriesQuery.data?.items || [],
    challenges: challengesQuery.data?.items || [],
    isLoading: categoriesQuery.isLoading || challengesQuery.isLoading,
    isError: !(categoriesQuery.data && challengesQuery.data),
    getChallengesByCategoryId,
  };
};

export default useChallengesQuery;
