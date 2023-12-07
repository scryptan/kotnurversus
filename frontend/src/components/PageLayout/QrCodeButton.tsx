import {
  BoxProps,
  Button,
  Center,
  SlideFade,
  useBoolean,
  useBreakpointValue,
} from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router-dom";
import Window from "~/components/Window";

const QrCodeButton = () => {
  const [isShow, setIsShow] = useBoolean(false);
  const isLarge = useBreakpointValue({ base: false, "2xl": true });

  return (
    <>
      <Button
        w="220px"
        variant="link"
        color="#808080"
        fontWeight="normal"
        textDecoration="underline"
        _hover={{
          color: "text.light.main",
          _dark: { color: "text.dark.main" },
        }}
        onClick={setIsShow.toggle}
        children={`${isShow ? "Скрыть" : "Показать"} QR-код страницы`}
      />
      {isLarge ? (
        <SlideFade
          in={isShow}
          unmountOnExit
          style={{ position: "fixed", right: "40px", bottom: "40px" }}
        >
          <QrCode size={156} />
        </SlideFade>
      ) : (
        <Window
          isHideSubmit
          isHideCancel
          isOpen={isShow}
          onClose={setIsShow.off}
        >
          <QrCode m={10} p={4} size={256} />
        </Window>
      )}
    </>
  );
};

type QrCodeProps = {
  size: number;
} & BoxProps;

const QrCode = ({ size, ...props }: QrCodeProps) => {
  const location = useLocation();

  return (
    <Center p={2} bg="white" borderRadius={8} {...props}>
      <QRCodeSVG size={size} value={`${window.origin}${location.pathname}`} />
    </Center>
  );
};

export default QrCodeButton;
