import { BoxProps, Stack, Text } from "@chakra-ui/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import ImageIcon from "~/icons/ImageIcon";

type Props = Omit<BoxProps, "onDrop"> &
  Pick<DropzoneOptions, "onDrop" | "accept">;

const Dropzone = ({ onDrop, accept, ...props }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
  });

  return (
    <Stack
      {...getRootProps()}
      p={8}
      w="full"
      spacing={2}
      align="center"
      borderRadius={6}
      border="1px dashed"
      borderColor="blackAlpha.800"
      transition="background 200ms ease-in-out"
      bg={isDragActive ? "blackAlpha.100" : undefined}
      _dark={{
        borderColor: "whiteAlpha.800",
        bg: isDragActive ? "whiteAlpha.100" : undefined,
      }}
      _focusVisible={{ outline: "none", boxShadow: "outline" }}
      {...props}
    >
      <input {...getInputProps()} />
      <ImageIcon boxSize={12} />
      <Text fontSize="lg" textAlign="center" lineHeight="150%">
        Выберите изображения или <br /> перетащите их в данную область
      </Text>
    </Stack>
  );
};

export default Dropzone;
