import { Box } from "@chakra-ui/react";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";
import CategoryButton from "./CategoryButton";

type Props = {
  category: Category;
  challenges: Challenge[];
};

const CategoryCard = ({ category, challenges: _ }: Props) => {
  return (
    <Box>
      <CategoryButton category={category} />
    </Box>
  );
};

export default CategoryCard;
