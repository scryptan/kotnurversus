import { AxiosError } from "axios";
import { useCallback } from "react";
import useCustomToast from "~/hooks/useCustomToast";
import { isDev } from "~/utils";

const useHandleError = () => {
  const toast = useCustomToast();

  return useCallback((error: unknown) => {
    isDev && console.error(error);

    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
          toast.error({ description: "Требуется авторизация" });
          return;
        case 403:
          toast.error({ description: "У вас недостаточно прав" });

          return;
      }
    }

    toast.unknown();
  }, []);
};

export default useHandleError;
