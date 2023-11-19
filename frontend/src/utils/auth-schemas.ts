import { z } from "zod";

const nonEmptyField = z
  .string({ required_error: "Заполните поле" })
  .min(1, "Заполните поле");

export const loginField = z
  .string({ required_error: "Заполните поле" })
  .min(5, "Минимальная длина 5 символов");

const passwordField = z
  .string({ required_error: "Заполните поле" })
  .min(5, "Минимальная длина 5 символов")
  .regex(/[a-z]/, "Пароль должен содержать строчную английскую букву")
  .regex(/[A-Z]/, "Пароль должен содержать заглавную английскую букву")
  .regex(/[0-9]/, "Пароль должен содержать цифру");

export const loginFormSchema = z.object({
  login: nonEmptyField,
  password: nonEmptyField,
});

export const registerFormSchema = z
  .object({
    login: loginField,
    password: passwordField,
    confirmPassword: nonEmptyField,
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли должны совпадать",
  });

export const passwordChangeFormSchema = z
  .object({
    oldPassword: nonEmptyField,
    password: passwordField,
    confirmPassword: nonEmptyField,
  })
  .refine((values) => values.oldPassword !== values.password, {
    path: ["password"],
    message: "Новый пароль не должен совпадать со старым",
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли должны совпадать",
  });
