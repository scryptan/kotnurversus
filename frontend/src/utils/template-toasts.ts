import { UseToastOptions } from "@chakra-ui/react";

export const successToast = (description: string): UseToastOptions => ({
  position: "bottom",
  title: "Успех!",
  description,
  status: "success",
  duration: 2500,
  isClosable: true,
});

export const warningToast = (
  options?: Partial<UseToastOptions>
): UseToastOptions => ({
  position: "bottom",
  title: "Предупреждение!",
  status: "warning",
  duration: 2500,
  isClosable: true,
  ...options,
});

export const errorToast = (description: string): UseToastOptions => ({
  position: "bottom",
  title: "Ошибка!",
  description,
  status: "error",
  duration: 2500,
  isClosable: true,
});

export const unknownErrorToast: UseToastOptions = {
  position: "bottom",
  title: "Ошибка",
  description: "Упс! Что-то пошло не так...",
  status: "error",
  duration: 2500,
  isClosable: true,
};
