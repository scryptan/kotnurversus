import { Box, ButtonProps, Text, Tooltip } from "@chakra-ui/react";
import chroma from "chroma-js";
import CatIcon from "~/icons/CatIcon";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";

type ChallengeCardProps = {
  category: Category;
  challenge: Challenge;
} & ButtonProps;

const ChallengeCard = ({
  challenge,
  category,
  ...props
}: ChallengeCardProps) => {
  const fontColor =
    chroma(category.color).luminance() < 0.5 ? "white" : "text.light.main";

  return (
    <Box
      pos="relative"
      as="button"
      outline="none"
      bg="blackAlpha.300"
      borderRadius={8}
      transition="box-shadow 200ms ease-out"
      _dark={{ bg: "whiteAlpha.300" }}
      _hover={{ boxShadow: `0px 0px 7px 0px ${category.color}` }}
      _focusVisible={{ boxShadow: "outline" }}
      {...props}
    >
      {challenge.isCatInBag && (
        <Tooltip
          hasArrow
          placement="top"
          openDelay={500}
          label="Это требование — Кот в мешке"
        >
          <CatIcon
            pos="absolute"
            top={0}
            left="50%"
            transform="translate(-50%, -70%)"
            boxSize={7}
          />
        </Tooltip>
      )}
      <Box px={4} py={2} color={fontColor} bg={category.color} borderRadius={8}>
        <Text
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight="130%"
          fontWeight="normal"
          wordBreak="break-word"
          noOfLines={2}
          children={challenge.title}
        />
      </Box>
      {challenge.shortDescription && (
        <Box px={2} py={1}>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            lineHeight="130%"
            fontWeight="normal"
            wordBreak="break-word"
            noOfLines={4}
            children={challenge.shortDescription}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChallengeCard;
