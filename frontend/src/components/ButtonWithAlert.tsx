import { Button, ButtonProps } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import Alert from "~/components/Alert";

type Props = {
  buttonText: string;
  alertText: string;
  closeBeforeSubmit?: boolean;
  onSubmit?: () => void;
} & Omit<ButtonProps, "onSubmit">;

const ButtonWithAlert = ({
  buttonText,
  alertText,
  isLoading,
  closeBeforeSubmit,
  onSubmit,
  ...props
}: Props) => {
  const alert = useDisclosure();

  if (!onSubmit) {
    return null;
  }

  const handleSubmit = async () => {
    if (closeBeforeSubmit) alert.onClose();
    onSubmit?.();
  };

  return (
    <>
      <Button
        isDisabled={isLoading}
        onClick={alert.onOpen}
        children={buttonText}
        {...props}
      />
      <Alert
        isOpen={alert.isOpen}
        isLoading={isLoading}
        onClose={alert.onClose}
        onSubmit={handleSubmit}
        children={alertText}
      />
    </>
  );
};

export default ButtonWithAlert;
