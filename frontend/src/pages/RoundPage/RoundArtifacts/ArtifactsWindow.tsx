import { Image, Stack, Text, useBoolean } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Window, { WindowProps } from "~/components/Window";
import NotAllowedIcon from "~/icons/NotAllowedIcon";
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
    <Window
      {...props}
      isHideCancel
      isHideSubmit
      contentProps={{ w: "100vw" }}
      bodyProps={{ p: 0 }}
    >
      <Carousel
        autoFocus
        useKeyboardArrows
        showThumbs={false}
        showStatus={false}
        selectedItem={defaultItem !== -1 ? defaultItem : 0}
      >
        {artifacts.map((artifact) => (
          <ArtifactItem key={artifact.id} artifact={artifact} />
        ))}
      </Carousel>
    </Window>
  );
};

type ArtifactItemProps = {
  artifact: RoundArtifact;
};

const ArtifactItem = ({ artifact }: ArtifactItemProps) => {
  const [isError, setIsError] = useBoolean(false);

  if (isError) {
    return (
      <Stack
        h="75vh"
        align="center"
        justify="center"
        spacing={10}
        userSelect="none"
      >
        <NotAllowedIcon boxSize={20} />
        <Text fontSize="2xl" lineHeight="150%">
          Не удалось загрузить изображение
        </Text>
      </Stack>
    );
  }

  return (
    <Image
      px={0.5}
      h="75vh"
      loading="lazy"
      key={artifact.id}
      objectFit="contain"
      userSelect="none"
      onError={setIsError.on}
      src={`${import.meta.env.VITE_API_URL}${artifact.content}`}
    />
  );
};

export default ArtifactsWindow;
