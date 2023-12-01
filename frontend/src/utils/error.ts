import { AxiosError } from "axios";

export const getErrorApiStatus = (e: unknown) => {
  if (!(e instanceof AxiosError)) return;
  return e.response?.data?.status;
};
