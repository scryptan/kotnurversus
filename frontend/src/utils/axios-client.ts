import axiosStatic, { AxiosError, AxiosResponse } from "axios";
import { isDev } from "~/utils";

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

export default {
  get: async <T>(url: string, params?: object): Promise<T> => {
    try {
      const res = await axios.get<T>(url, { params });
      isDev && console.log(`GET ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`GET ${url}`, error.response); // LOG
      throw error.response;
    }
  },
  post: async <T, K>(url: string, data?: K, params?: object): Promise<T> => {
    try {
      const res = await axios.post<K, AxiosResponse<T>>(url, data, { params });
      isDev && console.log(`POST ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`POST ${url}`, error.response); // LOG
      throw error.response;
    }
  },
  put: async <T, K>(url: string, data?: K): Promise<T> => {
    try {
      const res = await axios.put<K, AxiosResponse<T>>(url, data);
      isDev && console.log(`PUT ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`PUT ${url}`, error.response); // LOG
      throw error.response;
    }
  },
  delete: async <T>(url: string, params?: object): Promise<T> => {
    try {
      const res = await axios.delete<T>(url, { params });
      isDev && console.log(`DELETE ${url}`, res.data); // LOG
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      isDev && console.log(`DELETE ${url}`, error.response); // LOG
      throw error.response;
    }
  },
};
