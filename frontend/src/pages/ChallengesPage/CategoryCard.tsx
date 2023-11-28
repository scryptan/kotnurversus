import { Box, Wrap } from "@chakra-ui/react";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";
import CategoryButton from "./CategoryButton";
import ChallengeButton from "./ChallengeButton";
import CreateChallengeButton from "./CreateChallengeButton";

type Props = {
  category: Category;
  challenges: Challenge[];
};

const CategoryCard = ({ category, challenges }: Props) => (
  <Box>
    <CategoryButton category={category} />
    <Wrap mt={4} spacing={8}>
      {challenges
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((challenge) => (
          <ChallengeButton key={challenge.id} challenge={challenge} />
        ))}
      <CreateChallengeButton defaultCategoryId={category.id} />
    </Wrap>
  </Box>
);

export default CategoryCard;
