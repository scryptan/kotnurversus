import { getHours, getMinutes, isValid, set } from "date-fns";

export const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const setTimeToDate = (date: Date, time: string): Date => {
  if (!timeRegex.test(time)) return date;

  const [hours, minutes] = time.split(":").map((v) => parseInt(v));

  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
};

export const extractTimeFromDate = (date: Date): string => {
  if (!isValid(date)) return "00:00";
  const hours = `${getHours(date)}`.padStart(2, "0");
  const minutes = `${getMinutes(date)}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};
