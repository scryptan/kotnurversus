import { parseISO } from "date-fns";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

const isIsoDateString = (value: any): value is string => {
  return typeof value === "string" && ISODateFormat.test(value);
};

const handleDates = (data: any) => {
  if (isIsoDateString(data)) return parseISO(data);

  if (data === null || data === undefined || typeof data !== "object")
    return data;

  Object.entries(data).forEach(([key, value]) => {
    if (isIsoDateString(value)) data[key] = parseISO(value);
    else if (typeof value === "object") handleDates(value);
  });

  return data;
};

export default handleDates;
