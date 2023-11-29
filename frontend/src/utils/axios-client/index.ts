import axiosStatic, { AxiosError, AxiosResponse } from "axios";
import { isDev } from "~/utils";
import handleDates from "./handle-dates";

const axios = axiosStatic.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use(
  async (config) => {
    // config.headers.set("Authorization", `Bearer ${xxx}`);
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use((response) => {
  handleDates(response.data);
  return response;
});

export default {
  get: async <T>(url: string, params?: object): Promise<T> => {
    try {
      const res = await axios.get<T>(url, { params });
      isDev && console.log(`GET ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`GET ${url}`, error); // LOG
      throw error;
    }
  },
  post: async <T, K>(url: string, data?: K, params?: object): Promise<T> => {
    try {
      const res = await axios.post<K, AxiosResponse<T>>(url, data, { params });
      isDev && console.log(`POST ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`POST ${url}`, error); // LOG
      throw error;
    }
  },
  patch: async <T, K>(url: string, data?: K): Promise<T> => {
    try {
      const res = await axios.patch<K, AxiosResponse<T>>(url, data);
      isDev && console.log(`PATCH ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`PATCH ${url}`, error); // LOG
      throw error;
    }
  },
  delete: async <T>(url: string, params?: object): Promise<T> => {
    try {
      const res = await axios.delete<T>(url, { params });
      isDev && console.log(`DELETE ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`DELETE ${url}`, error); // LOG
      throw error;
    }
  },
};
