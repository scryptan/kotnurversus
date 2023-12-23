import { Grid } from "@chakra-ui/react";
import { useState } from "react";
import { useRoundContext } from "../round-context";
import AddImagesButton from "./AddImagesButton";
import ArtifactItem from "./ArtifactItem";
import ArtifactsWindow from "./ArtifactsWindow";

const RoundGallery = () => {
  const { isOrganizer, round } = useRoundContext();
  const [activeId, setActiveId] = useState<string>();

  if (!(isOrganizer || round.artifacts.length)) return null;

  return (
    <Grid
      px={2}
      w="full"
      gridTemplateColumns={{
        base: "repeat(auto-fill, 100px)",
        md: "repeat(auto-fill, 175px)",
      }}
      gridAutoRows={{ base: "100px", md: "175px" }}
      gap={{ base: 4, md: 6 }}
      justifyContent="center"
    >
      {round.artifacts.map((artifact) => (
        <ArtifactItem
          key={artifact.id}
          roundId={round.id}
          artifact={artifact}
          onClick={setActiveId}
          isOrganizer={isOrganizer}
        />
      ))}
      {isOrganizer && <AddImagesButton />}
      <ArtifactsWindow
        defaultArtifactId={activeId}
        artifacts={round.artifacts}
        isOpen={activeId !== undefined}
        onClose={() => setActiveId(undefined)}
      />
    </Grid>
  );
};

export default RoundGallery;
