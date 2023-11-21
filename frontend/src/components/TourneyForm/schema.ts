import { startOfDay } from "date-fns";
import { ZodIssueCode, z } from "zod";
import { CreateTourney, Tourney, TourneyType } from "~/types/tourney";
import { extractTimeFromDate, setTimeToDate, timeRegex } from "~/utils/time";

export const tourneyFormSchema = z.object({
  title: z.string().min(1, "Заполните поле"),
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
});

export type TourneyFormSchema = z.infer<typeof tourneyFormSchema>;

export const castToFormSchema = (tourney: Tourney): TourneyFormSchema => ({
  title: tourney.title,
  day: startOfDay(tourney.startDate),
  time: extractTimeFromDate(tourney.startDate),
  type: tourney.form,
  description: tourney.description,
});

export const castToCreateTourney = (
  data: TourneyFormSchema
): CreateTourney => ({
  title: data.title,
  form: data.type,
  startDate: setTimeToDate(data.day, data.time),
  description: data.description,
});
