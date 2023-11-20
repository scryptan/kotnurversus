import { UseToastOptions } from "@chakra-ui/react";

export const successToast = (description: string): UseToastOptions => ({
  position: "bottom",
  title: "Успех!",
  description,
  status: "success",
  duration: 2500,
  isClosable: true,
});

export const warningToast = (description: string): UseToastOptions => ({
  position: "bottom",
  title: "Предупреждение!",
  description,
  status: "warning",
  duration: 2500,
  isClosable: true,
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
