import { BoxProps, Button, Stack, Text, useDisclosure } from "@chakra-ui/react";
import chroma from "chroma-js";
import { memo } from "react";
import useChallengesQuery from "~/hooks/useChallengesQuery";
import ChallengeWindow from "~/pages/RoundPage/RoundStages/ChallengeWindow";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";
import { useRoundContext } from "../round-context";

type Props = {
  teamId: string;
} & BoxProps;

const ChallengesSection = ({ teamId, ...props }: Props) => {
  const { round } = useRoundContext();

  const chosenChallengeIds =
    round.participants.find((p) => p.teamId === teamId)?.challenges || [];

  const query = useChallengesQuery({ enabled: chosenChallengeIds.length > 0 });

  if (chosenChallengeIds.length < 1) return null;

  return (
    <Stack spacing={4} {...props}>
      {chosenChallengeIds.map((id) => {
        const challenge = query.challenges.find((c) => c.id === id);
        const category = query.categories.find(
          (c) => c.id === challenge?.categoryId
        );
        if (!challenge || !category) return null;
        return (
          <ChallengeCard key={id} category={category} challenge={challenge} />
        );
      })}
    </Stack>
  );
};

type ChallengeCardProps = {
  category: Category;
  challenge: Challenge;
};

const ChallengeCard = memo(
  ({ challenge, category }: ChallengeCardProps) => {
    const window = useDisclosure();

    const fontColor =
      chroma(category.color).luminance() < 0.5 ? "white" : "text.light.main";

    const borderColor = chroma(category.color).darken(0.25).hex();

    return (
      <>
        <Button
          {...window.getButtonProps()}
          px={4}
          py={2}
          variant="link"
          color={fontColor}
          bg={category.color}
          borderRadius={8}
          border="1px solid"
          borderColor={borderColor}
          whiteSpace="normal"
          onClick={window.onOpen}
          _active={{ textDecoration: "underline" }}
          boxShadow={`0px 0px 5px 0px ${borderColor}`}
        >
          <Text
            fontSize="xl"
            lineHeight="150%"
            fontWeight="normal"
            wordBreak="break-word"
            children={challenge.title}
          />
        </Button>
        <ChallengeWindow
          {...window.getDisclosureProps()}
          isOpen={window.isOpen}
          onClose={window.onClose}
          category={category}
          challenge={challenge}
        />
      </>
    );
  },
  (prev, next) => prev.challenge.id === next.challenge.id
);

export default ChallengesSection;
