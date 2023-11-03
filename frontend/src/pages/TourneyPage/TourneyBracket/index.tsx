import { SingleEliminationBracket } from "@g-loot/react-tournament-brackets";
import { CommonTreeProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { TourneyMatch } from "~/types/tourney";
import Match from "./Match";
import SvgViewer from "./SvgViewer";

type Props = {
  matches: TourneyMatch[];
};

const TourneyBracket = ({ matches }: Props) => (
  <SingleEliminationBracket
    options={options}
    matches={matches}
    matchComponent={Match}
    svgWrapper={({ children, ...props }) => (
      <SvgViewer containerProps={{ px: 4 }} {...props} children={children} />
    )}
  />
);

const options: CommonTreeProps["options"] = {
  style: {
    width: 256,
    boxHeight: 84,
    spaceBetweenRows: 20,
    connectorColor: "#ADADAD",
    roundHeader: { isShown: false },
    lineInfo: {
      homeVisitorSpread: 0,
    },
  },
};

export default TourneyBracket;
