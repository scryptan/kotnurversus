import { Wrap, WrapProps, useDisclosure } from "@chakra-ui/react";
import { memo } from "react";
import BaseChallengeCard from "~/components/ChallengeCard";
import useChallengesQuery from "~/hooks/useChallengesQuery";
import { useRoundContext } from "~/pages/RoundPage/round-context";
import { Category } from "~/types/category";
import { Challenge } from "~/types/challenge";
import ChallengeWindow from "./ChallengeWindow";

type Props = {
  teamId: string;
} & WrapProps;

const StageChallenges = ({ teamId, ...props }: Props) => {
  const { round } = useRoundContext();

  const chosenChallengeIds =
    round.participants.find((p) => p.teamId === teamId)?.challenges || [];

  const query = useChallengesQuery({ enabled: chosenChallengeIds.length > 0 });

  if (chosenChallengeIds.length < 1) return null;

  const isFirstTeam = round.participants.at(0)?.teamId === teamId;

  return (
    <Wrap
      w="full"
      spacing={4}
      align="flex-start"
      justifySelf={isFirstTeam ? "flex-end" : "flex-start"}
      justify={{ base: "center", md: isFirstTeam ? "flex-end" : "flex-start" }}
      {...props}
    >
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
    </Wrap>
  );
};

type ChallengeCardProps = {
  category: Category;
  challenge: Challenge;
};

const ChallengeCard = memo(
  ({ challenge, category }: ChallengeCardProps) => {
    const window = useDisclosure();

    return (
      <>
        <BaseChallengeCard
          w="95%"
          maxW="160px"
          category={category}
          challenge={challenge}
          onClick={window.onOpen}
        />
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

export default StageChallenges;
