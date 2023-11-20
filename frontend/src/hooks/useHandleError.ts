import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { isDev } from "~/utils";
import { unknownErrorToast } from "~/utils/template-toasts";

const useHandleError = () => {
  const toast = useToast();

  return useCallback((error: unknown) => {
    isDev && console.error(error);
    toast(unknownErrorToast);
  }, []);
};

export default useHandleError;
