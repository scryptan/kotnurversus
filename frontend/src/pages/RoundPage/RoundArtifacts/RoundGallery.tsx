import { Wrap } from "@chakra-ui/react";
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
    <Wrap px={2} spacing={{ base: 4, md: 6 }}>
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
    </Wrap>
  );
};

export default RoundGallery;
