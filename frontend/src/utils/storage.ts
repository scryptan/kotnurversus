type StorageParams = {
  isSession?: boolean;
};

const storage = (params: StorageParams = {}) => {
  return params.isSession ? window.sessionStorage : window.localStorage;
};

const has = (key: string, params?: StorageParams): boolean => {
  return Boolean(storage(params).getItem(key));
};

const get = (key: string, params?: StorageParams): string | undefined => {
  return storage(params).getItem(key) || undefined;
};

const getBoolean = (key: string, params?: StorageParams): boolean => {
  return get(key, params) === "true";
};

const getObject = <T>(key: string, params?: StorageParams): T | undefined => {
  const jsonString = get(key, params);
  if (jsonString) {
    try {
      return JSON.parse(jsonString) as T;
    } catch {
      return undefined;
    }
  }
};

const set = (key: string, value: string, params?: StorageParams): void => {
  try {
    storage(params).setItem(key, value);
  } catch (error) {
    console.warn(error);
  }
};

const setObject = <T extends object>(
  key: string,
  value: T,
  params?: StorageParams
): void => {
  const jsonString = JSON.stringify(value);
  set(key, jsonString, params);
};

const remove = (key: string, params?: StorageParams): void => {
  storage(params).removeItem(key);
};

export default {
  has,
  get,
  getBoolean,
  getObject,
  set,
  setObject,
  remove,
};
