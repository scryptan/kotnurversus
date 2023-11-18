import {
  Button,
  ButtonProps,
  Heading,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalHeaderProps,
  ModalOverlay,
  ModalProps,
  Spacer,
  Spinner,
  useColorMode,
  useForceUpdate,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

export type WindowProps<T = Record<string, unknown>> = T &
  Omit<Props, "children">;

type Props = {
  isLoading?: boolean;
  isWindowLoading?: boolean;
  isHideSubmit?: boolean;
  isHideCancel?: boolean;
  isHideClose?: boolean;
  heading?: string;
  submitProps?: ButtonProps;
  cancelProps?: ButtonProps;
  contentProps?: ModalContentProps;
  headerProps?: ModalHeaderProps;
  bodyProps?: ModalBodyProps;
  footerProps?: ModalFooterProps;
  ExtraButton?: () => ReactNode;
} & ModalProps;

const Window = ({
  isOpen,
  onClose,
  isLoading,
  isWindowLoading,
  isHideSubmit,
  isHideCancel,
  isHideClose,
  heading,
  submitProps,
  cancelProps,
  contentProps,
  headerProps,
  bodyProps,
  footerProps,
  ExtraButton,
  children,
  ...props
}: WindowProps<Props>) => {
  const { colorMode } = useColorMode();
  const isMount = useRef(false);
  const forceUpdate = useForceUpdate();

  if (isOpen) {
    isMount.current = true;
  }

  if (!isMount.current) {
    return null;
  }

  return (
    <Modal
      isCentered
      preserveScrollBarGap
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
      onCloseComplete={() => {
        isMount.current = false;
        forceUpdate();
      }}
      {...props}
    >
      <ModalOverlay />
      {isWindowLoading ? (
        <Spinner
          color="primary.4"
          pos="fixed"
          top="50%"
          left="50%"
          zIndex="modal"
          size="lg"
        />
      ) : (
        <ModalContent
          w="fit-content"
          maxW={["95%", "95%", "85%"]}
          maxH={["95%", "95%", "85%"]}
          bg={`bg.${colorMode}.1`}
          boxShadow="base"
          borderRadius={10}
          {...contentProps}
        >
          {!isHideClose && <ModalCloseButton />}

          {heading && (
            <ModalHeader px={6} py={4} {...headerProps}>
              <Heading
                fontSize="2xl"
                noOfLines={1}
                wordBreak="break-all"
                children={heading}
              />
            </ModalHeader>
          )}

          <ModalBody
            px={6}
            pt={heading ? 2 : 4}
            pb={!(isHideSubmit && isHideCancel) ? 2 : 4}
            overflowX="hidden"
            children={children}
            {...bodyProps}
          />

          {(!isHideSubmit || !isHideCancel) && (
            <ModalFooter px={6} py={4} gap={4} {...footerProps}>
              {ExtraButton && <ExtraButton />}
              <Spacer />
              {!isHideCancel && (
                <Button
                  variant="ghost"
                  isDisabled={isLoading}
                  onClick={onClose}
                  children="Отмена"
                  {...cancelProps}
                />
              )}
              {!isHideSubmit && (
                <Button
                  variant="solid"
                  colorScheme="teal"
                  isLoading={isLoading}
                  children="Сохранить"
                  {...submitProps}
                />
              )}
            </ModalFooter>
          )}
        </ModalContent>
      )}
    </Modal>
  );
};

export default Window;
