import { startOfDay } from "date-fns";
import { ZodIssueCode, z } from "zod";
import { CreateTourney, Tourney, TourneyType } from "~/types/tourney";
import time from "~/utils/time";

export const tourneyFormSchema = z.object({
  title: z.string().min(1, "Заполните поле"),
  day: z
    .date({
      errorMap: (issue) => {
        const map: Record<string, string> = {
          [ZodIssueCode.invalid_date]: "Некорректная дата",
        };
        return { message: map[issue.code] || "Заполните поле" };
      },
    })
    .min(startOfDay(new Date()), "Укажите будущую дату"),
  time: z
    .string({ required_error: "Заполните поле" })
    .min(5, "Заполните поле")
    .regex(time["hh:mm"].regexp, "Некорректное время"),
  type: z.nativeEnum(TourneyType).default(TourneyType.Offline),
  description: z.string().optional(),
  withoutChallengesRepeatInFinal: z.boolean().default(false),
  catsInTheBag: z.boolean().default(false),
});

export type TourneyFormSchema = z.infer<typeof tourneyFormSchema>;

export const castToFormSchema = (tourney: Tourney): TourneyFormSchema => ({
  title: tourney.title,
  day: startOfDay(tourney.startDate),
  time: time["hh:mm"].castDateToTime(tourney.startDate),
  type: tourney.form,
  description: tourney.description,
  catsInTheBag: tourney.settings.catsInTheBag,
  withoutChallengesRepeatInFinal:
    tourney.settings.withoutChallengesRepeatInFinal,
});

export const castToCreateTourney = (
  data: TourneyFormSchema
): CreateTourney => ({
  title: data.title,
  form: data.type,
  startDate: time["hh:mm"].castTimeToDate(data.day, data.time),
  description: data.description,
  settings: {
    catsInTheBag: data.catsInTheBag,
    withoutChallengesRepeatInFinal: data.withoutChallengesRepeatInFinal,
  },
});
