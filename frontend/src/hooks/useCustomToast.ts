import {
  CreateToastFnReturn,
  ToastId,
  UseToastOptions,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";

type UseCustomToastParams = {
  onlyOne?: boolean;
};

type UseCustomToastReturn = {
  base: CreateToastFnReturn;
  success: (options?: UseToastOptions) => ToastId;
  warning: (options?: UseToastOptions) => ToastId;
  error: (options?: UseToastOptions) => ToastId;
  unknown: (options?: UseToastOptions) => ToastId;
};

const defaultParams: UseCustomToastParams = {
  onlyOne: true,
};

const useCustomToast = (params = defaultParams): UseCustomToastReturn => {
  const toast = useToast(baseOptions);
  const lastToastId = useRef<ToastId>();

  const createToast =
    (customOptions: UseToastOptions) =>
    (options?: UseToastOptions): ToastId => {
      if (
        params.onlyOne &&
        lastToastId.current &&
        toast.isActive(lastToastId.current)
      ) {
        toast.update(lastToastId.current, {
          ...customOptions,
          ...options,
        });

        return lastToastId.current;
      }

      const toastId = toast({ ...customOptions, ...options });
      lastToastId.current = toastId;

      return toastId;
    };

  return {
    base: toast,
    success: createToast(successOptions),
    warning: createToast(warningOptions),
    error: createToast(errorOptions),
    unknown: createToast(unknownOptions),
  };
};

const baseOptions: UseToastOptions = {
  position: "bottom",
  duration: 2500,
  isClosable: true,
};

const successOptions: UseToastOptions = {
  title: "Успех!",
  status: "success",
};

const warningOptions: UseToastOptions = {
  title: "Предупреждение!",
  status: "warning",
};

const errorOptions: UseToastOptions = {
  title: "Ошибка!",
  status: "error",
};

const unknownOptions: UseToastOptions = {
  ...errorOptions,
  description: "Упс! Что-то пошло не так...",
};

export default useCustomToast;
