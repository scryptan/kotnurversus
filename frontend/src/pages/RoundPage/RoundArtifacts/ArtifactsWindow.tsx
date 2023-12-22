import { Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Window, { WindowProps } from "~/components/Window";
import { RoundArtifact } from "~/types/round";

type Props = {
  defaultArtifactId?: string;
  artifacts: RoundArtifact[];
};

const ArtifactsWindow = ({
  defaultArtifactId,
  artifacts,
  ...props
}: WindowProps<Props>) => {
  const defaultItem = artifacts.findIndex((a) => a.id === defaultArtifactId);

  return (
    <Window {...props} isHideCancel isHideSubmit bodyProps={{ p: 0 }}>
      <Carousel
        autoFocus
        useKeyboardArrows
        showThumbs={false}
        showStatus={false}
        selectedItem={defaultItem !== -1 ? defaultItem : 0}
      >
        {artifacts.map((artifact) => (
          <Image
            h="75vh"
            loading="lazy"
            key={artifact.id}
            objectFit="contain"
            userSelect="none"
            src={`${import.meta.env.VITE_API_URL}${artifact.content}`}
          />
        ))}
      </Carousel>
    </Window>
  );
};

export default ArtifactsWindow;
