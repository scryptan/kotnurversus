import { HStack, Heading } from "@chakra-ui/react";
import { SingleEliminationBracket } from "@g-loot/react-tournament-brackets";
import { CommonTreeProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import api from "~/api";
import {
  TourneySpecification,
  TourneyState,
  TourneyTeam,
} from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import { castToTourneyRound } from "~/utils/round";
import {
  addSpecificationToRound,
  createMatchesFromTeams,
} from "~/utils/tourney";
import { useTourneyContext } from "../tourney-context";
import Match from "./Match";
import TeamsManualSortingButton from "./TeamsManualSortingButton";
import TeamsShuffleButton from "./TeamsShuffleButton";
import TourneyBracketContainer from "./TourneyBracketContainer";

type Props = {
  id: string;
  state: TourneyState;
  specifications: TourneySpecification[];
};

const TourneyBracket = ({ id, state, specifications }: Props) => {
  const { isDesktop, isEditable, teams, useSubscribe } = useTourneyContext();

  useSubscribe("teams");

  const isPrepare = state === TourneyState.Prepare;

  const roundsQuery = useQuery({
    queryKey: queryKeys.rounds(id),
    queryFn: () => api.rounds.findByTourneyId(id),
    enabled: !isPrepare,
  });

  const [previewRounds, setPreviewRounds] = useState(() =>
    calcRounds(teams.get, isEditable ? specifications : undefined)
  );

  useEffect(() => {
    if (!isPrepare) return;
    setPreviewRounds(
      calcRounds(teams.get, isEditable ? specifications : undefined)
    );
  }, [calcTeamsKey(teams.get), specifications, isEditable]);

  const rounds =
    isPrepare || roundsQuery.isLoading
      ? roundsQuery.isLoading
        ? previewRounds.map((r) => ({ ...r, isLoading: true }))
        : previewRounds
      : (roundsQuery.data?.items || []).map(castToTourneyRound(teams.get));

  if (teams.get.length < 4 || rounds.length < 2 || roundsQuery.isError) {
    const message = roundsQuery.isError
      ? "Не удалось загрузить турнирную сетку"
      : isEditable
      ? "Создайте минимум 4 команды для построения турнирной сетки"
      : "Турнирная сетка не построена";

    return (
      <Heading
        my="100px"
        mx="auto"
        fontSize={{ base: "md", md: "lg" }}
        children={message}
      />
    );
  }

  const bracket = (
    <SingleEliminationBracket
      options={isDesktop ? desktopOptions : mobileOptions}
      matches={rounds}
      matchComponent={Match}
      svgWrapper={({ children, bracketWidth }) => (
        <TourneyBracketContainer
          mt={4}
          bracketWidth={bracketWidth}
          children={children}
        />
      )}
    />
  );

  if (isEditable) {
    return (
      <>
        {bracket}
        <ActionsButton teams={teams.get} onTeamsChange={teams.set} />
      </>
    );
  }

  return bracket;
};

const mobileOptions: CommonTreeProps["options"] = {
  style: {
    width: 228,
    boxHeight: 112,
    canvasPadding: 0,
    spaceBetweenRows: 20,
    horizontalOffset: 0,
    roundSeparatorWidth: 50,
    connectorColor: "#ADADAD",
    roundHeader: { isShown: false },
    lineInfo: {
      homeVisitorSpread: 0,
    },
  },
};

const desktopOptions: CommonTreeProps["options"] = {
  style: {
    ...mobileOptions.style,
    width: 268,
    boxHeight: 132,
  },
};

type ActionsButtonProps = {
  teams: TourneyTeam[];
  onTeamsChange: (teams: TourneyTeam[]) => void;
};

const ActionsButton = ({ teams, onTeamsChange }: ActionsButtonProps) => (
  <HStack>
    <TeamsShuffleButton teams={teams} onTeamsChange={onTeamsChange} />
    <TeamsManualSortingButton teams={teams} onSubmit={onTeamsChange} />
  </HStack>
);

const calcRounds = (
  teams: TourneyTeam[],
  specifications?: TourneySpecification[]
) => {
  const rounds = createMatchesFromTeams(teams);
  return specifications !== undefined
    ? rounds.map(addSpecificationToRound(specifications))
    : rounds;
};

const calcTeamsKey = (teams: TourneyTeam[]) =>
  teams.map((t) => `${t.id}:${t.title}`).join("|");

const calcSpecificationsKey = (specifications: TourneySpecification[]) =>
  specifications.map((s) => s.title).join("|");

export default memo(TourneyBracket, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.state === next.state &&
    calcSpecificationsKey(prev.specifications) ===
      calcSpecificationsKey(next.specifications)
  );
});
