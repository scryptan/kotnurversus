import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { isDev } from "~/utils";
import { errorToast, unknownErrorToast } from "~/utils/template-toasts";

const useHandleError = () => {
  const toast = useToast();

  return useCallback((error: unknown) => {
    isDev && console.error(error);

    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
          toast(errorToast("Требуется авторизация"));
          return;
        case 403:
          toast(errorToast("У вас недостаточно прав"));
          return;
      }
    }

    toast(unknownErrorToast);
  }, []);
};

export default useHandleError;
