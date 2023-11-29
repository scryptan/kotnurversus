import { getHours, getMinutes, isValid, set } from "date-fns";

const timeHelpers = {
  "hh:mm": {
    regexp: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    castDateToTime: (date: Date): string => {
      if (!isValid(date)) return "00:00";
      const hours = `${getHours(date)}`.padStart(2, "0");
      const minutes = `${getMinutes(date)}`.padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    castTimeToDate: (date: Date, time: string): Date => {
      if (!timeHelpers["hh:mm"].regexp.test(time)) return date;
      const [hours, minutes] = time.split(":").map((v) => parseInt(v));
      return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
    },
  },
  "mm:ss": {
    regexp: /^[0-5][0-9]:[0-5][0-9]$/,
    castSecondsToTime: (totalSeconds: number): string => {
      if (totalSeconds < 1) return "00:00";
      const seconds = `${totalSeconds % 60}`.padStart(2, "0");
      const minutes = `${Math.floor(totalSeconds / 60)}`.padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
    castTimeToSeconds: (time: string): number => {
      if (!timeHelpers["mm:ss"].regexp.test(time)) return 0;
      const [minutes, seconds] = time.split(":").map((v) => parseInt(v));
      return minutes * 60 + seconds;
    },
  },
};

export default timeHelpers;
