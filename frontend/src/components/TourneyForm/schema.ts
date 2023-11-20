import { ZodIssueCode, z } from "zod";
import { TourneyType } from "~/types/tourney";
import { timeRegex } from "~/utils/time";

export const tourneyFormSchema = z.object({
  name: z.string().min(1, "Заполните поле"),
  day: z.date({
    errorMap: (issue) => {
      const map: Record<string, string> = {
        [ZodIssueCode.invalid_date]: "Некорректная дата",
      };
      return { message: map[issue.code] || "Заполните поле" };
    },
  }),
  time: z
    .string({ required_error: "Заполните поле" })
    .min(5, "Заполните поле")
    .regex(timeRegex, "Некорректное время"),
  type: z.nativeEnum(TourneyType).default(TourneyType.Offline),
  description: z.string().optional(),
  requirementIds: z.number().array().default([]),
});

export type TourneyFormSchema = z.infer<typeof tourneyFormSchema>;
