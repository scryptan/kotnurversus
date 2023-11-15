export type SelectValue = number | string | boolean;

export type SelectOption<T extends SelectValue> = {
  label: string;
  value: T;
};
