import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { Challenge } from "~/types/challenge";
import queryKeys from "~/utils/query-keys";

type UseChallengesQueryParams = {
  roundId?: string;
  enabled?: boolean;
};

const useChallengesQuery = ({
  roundId,
  enabled,
}: UseChallengesQueryParams = {}) => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.categories.find,
    staleTime: 1000 * 60 * 50,
    enabled,
  });

  const challengesQuery = useQuery({
    queryKey: queryKeys.challenges(roundId),
    queryFn: () => {
      if (roundId) return api.rounds.findAvailableChallenges(roundId);
      return api.challenges.find();
    },
    staleTime: 1000 * 60 * 50,
    enabled,
  });

  const getChallengesByCategoryId = (
    challenges: Challenge[] = challengesQuery.data?.items || []
  ): Record<string, Challenge[]> =>
    challenges.reduce(
      (result, challenge) => {
        if (!result[challenge.categoryId]) {
          result[challenge.categoryId] = [];
        }
        result[challenge.categoryId].push(challenge);
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
