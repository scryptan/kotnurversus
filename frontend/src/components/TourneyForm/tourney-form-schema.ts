import { z } from "zod";
import { TourneyType } from "~/types/tourney";

export const tourneyFormSchema = z.object({
  name: z.string().min(1, "Заполните поле"),
  day: z.date({ required_error: "Заполните поле" }),
  time: z.string({ required_error: "Заполните поле" }).min(5, "Заполните поле"),
  type: z.nativeEnum(TourneyType).default(TourneyType.Offline),
  location: z.string().optional(),
  requirementIds: z.number().array().default([]),
});

export type TourneyFormSchema = z.infer<typeof tourneyFormSchema>;
