import {
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  Wrap,
  useBoolean,
} from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import Dropzone from "~/components/Dropzone";
import Window, { WindowProps } from "~/components/Window";
import useCustomToast from "~/hooks/useCustomToast";
import CrossIcon from "~/icons/CrossIcon";

const MAX_IMAGES = 10;

type Props = {
  onSubmit: (images: File[]) => Promise<void>;
};

const AddImagesWindow = ({ onSubmit, ...props }: WindowProps<Props>) => {
  const toast = useCustomToast();
  const [chosenImages, setChosenImages] = useState<File[]>([]);

  const handleAddImages = async (newImages: File[]) => {
    const images = Object.values(
      Object.fromEntries(
        [...chosenImages, ...newImages].map((image) => [image.name, image])
      )
    );

    if (images.length > 10) {
      toast.warning({
        description: `За один раз можно прикрепить максимум ${MAX_IMAGES} изображений`,
      });
      return;
    }
    setChosenImages(images);
  };

  const handleRemove = (image: File) => () => {
    setChosenImages((images) => images.filter((i) => i.name !== image.name));
  };

  const handleSubmit = async () => {
    await onSubmit(chosenImages);
    setChosenImages([]);
  };

  return (
    <Window
      {...props}
      heading="Прикрепить материал"
      contentProps={{ w: "600px" }}
      submitProps={{
        isDisabled: chosenImages.length < 1,
        onClick: handleSubmit,
        children: "Сохранить",
      }}
    >
      <Stack spacing={4}>
        <Text fontSize="md">
          Прикрепите изображения в формате jpg, jpeg, png
        </Text>
        <Dropzone
          onDrop={handleAddImages}
          accept={{
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
            "image/png": [".png"],
          }}
        />
        {chosenImages.length > 0 && (
          <Wrap spacing={4}>
            {chosenImages.map((image) => (
              <ImageItem
                key={image.name}
                image={image}
                onRemove={handleRemove(image)}
              />
            ))}
          </Wrap>
        )}
      </Stack>
    </Window>
  );
};

type ImageItemProps = {
  image: File;
  onRemove: () => void;
};

const ImageItem = memo(
  ({ image, onRemove }: ImageItemProps) => {
    const [isLoading, setIsLoading] = useBoolean(true);
    const imageBase64 = useRef("");

    useEffect(() => {
      const loadImage = async () => {
        setIsLoading.on();
        try {
          imageBase64.current = await getBase64(image);
        } catch {
          onRemove();
        } finally {
          setIsLoading.off();
        }
      };
      loadImage();
    }, [image.name]);

    return (
      <Skeleton pos="relative" isLoaded={!isLoading} borderRadius={4}>
        <Image
          boxSize={24}
          objectFit="cover"
          borderRadius={4}
          src={imageBase64.current}
        />
        <IconButton
          pos="absolute"
          top={-2}
          right={-2}
          size="xs"
          variant="solid"
          colorScheme="red"
          borderRadius="full"
          aria-label="Удалить изображение"
          icon={<CrossIcon boxSize={5} />}
          onClick={onRemove}
        />
      </Skeleton>
    );
  },
  (prev, next) => prev.image.name === next.image.name
);

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default AddImagesWindow;
