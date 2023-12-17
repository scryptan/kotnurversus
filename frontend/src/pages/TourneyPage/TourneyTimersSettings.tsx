import { BoxProps, Stack, Text, Wrap } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { ReactNode, memo, useId, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import api from "~/api";
import CollapsibleSection from "~/components/CollapsibleSection";
import NumberInput from "~/components/NumberInput";
import TimeInput from "~/components/TimeInput";
import useDebounce from "~/hooks/useDebounce";
import { TourneySettings } from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import time from "~/utils/time";
import { useTourneyContext } from "./tourney-context";

type Props = {
  id: string;
  settings: TourneySettings;
};

const TourneyTimersSettings = ({ id, settings: defaultSettings }: Props) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const settings = useRef(defaultSettings);
  const { isEditable } = useTourneyContext();

  const { control, handleSubmit } = useForm<SettingsSchema>({
    shouldFocusError: false,
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      prepareTime: time["mm:ss"].castSecondsToTime(
        defaultSettings.prepareSeconds
      ),
      presentationTime: time["mm:ss"].castSecondsToTime(
        defaultSettings.presentationSeconds
      ),
      defenseTime: time["mm:ss"].castSecondsToTime(
        defaultSettings.defenseSeconds
      ),
      timeoutTime: time["mm:ss"].castSecondsToTime(
        defaultSettings.timeoutSeconds
      ),
      timeoutCount: defaultSettings.timeoutsCount,
    },
  });

  const editSettings = useMutation({
    mutationFn: async (newSettings: TourneySettings) => {
      const operations = compare(
        { settings: settings.current },
        { settings: newSettings }
      );
      return await api.tourneys.patch(id, operations);
    },
    onSuccess: async (tourney) => {
      settings.current = tourney.settings;
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
    },
  });

  if (!isEditable) {
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    debounce.set(() =>
      editSettings.mutateAsync({
        ...settings.current,
        prepareSeconds: time["mm:ss"].castTimeToSeconds(data.prepareTime),
        presentationSeconds: time["mm:ss"].castTimeToSeconds(
          data.presentationTime
        ),
        defenseSeconds: time["mm:ss"].castTimeToSeconds(data.defenseTime),
        timeoutSeconds: time["mm:ss"].castTimeToSeconds(data.timeoutTime),
        timeoutsCount: data.timeoutCount,
      })
    );
  });

  return (
    <CollapsibleSection
      label="Настройки таймера"
      storageKey={`tourney:${id}:timers-visibility`}
      headerProps={{ px: { base: 2, md: 0 } }}
    >
      <Wrap
        mt={6}
        as="form"
        spacingX="100px"
        spacingY={6}
        align="flex-start"
        justify="space-around"
        onChange={onSubmit}
      >
        <FormLabel label="Подготовка">
          {(id) => (
            <Controller
              name="prepareTime"
              control={control}
              render={({ field, fieldState }) => (
                <TimeInput
                  {...field}
                  id={id}
                  placeholder="мм:сс"
                  errorMessage={fieldState.error?.message}
                  containerProps={{ w: "140px" }}
                />
              )}
            />
          )}
        </FormLabel>
        <FormLabel label="Презентация">
          {(id) => (
            <Controller
              name="presentationTime"
              control={control}
              render={({ field, fieldState }) => (
                <TimeInput
                  {...field}
                  id={id}
                  placeholder="мм:сс"
                  errorMessage={fieldState.error?.message}
                  containerProps={{ w: "140px" }}
                />
              )}
            />
          )}
        </FormLabel>
        <FormLabel label="Защита">
          {(id) => (
            <Controller
              name="defenseTime"
              control={control}
              render={({ field, fieldState }) => (
                <TimeInput
                  {...field}
                  id={id}
                  placeholder="мм:сс"
                  errorMessage={fieldState.error?.message}
                  containerProps={{ w: "140px" }}
                />
              )}
            />
          )}
        </FormLabel>
        <FormLabel label="Количество таймаутов">
          {(id) => (
            <Controller
              name="timeoutCount"
              control={control}
              render={({ field, fieldState }) => (
                <NumberInput
                  {...field}
                  id={id}
                  max={10}
                  maxLength={2}
                  onBlur={onSubmit}
                  errorMessage={fieldState.error?.message}
                  containerProps={{ w: "85px" }}
                />
              )}
            />
          )}
        </FormLabel>
        <FormLabel label="Длительность таймаута">
          {(id) => (
            <Controller
              name="timeoutTime"
              control={control}
              render={({ field, fieldState }) => (
                <TimeInput
                  {...field}
                  id={id}
                  placeholder="мм:сс"
                  errorMessage={fieldState.error?.message}
                  containerProps={{ w: "140px" }}
                />
              )}
            />
          )}
        </FormLabel>
      </Wrap>
    </CollapsibleSection>
  );
};

type FormLabelProps = {
  label: string;
  isRequired?: boolean;
  children: ReactNode | ((id: string) => ReactNode);
} & Omit<BoxProps, "children">;

const FormLabel = ({ label, children, ...props }: FormLabelProps) => {
  const id = useId();
  const needId = typeof children === "function";

  return (
    <Stack w="fit-content" align="center" spacing={4} {...props}>
      <Text
        w="fit-content"
        fontSize="md"
        fontWeight="medium"
        {...(needId ? { as: "label", htmlFor: id } : {})}
        children={label}
      />
      {needId ? children(id) : children}
    </Stack>
  );
};

const timeSchema = z
  .string()
  .min(1, "Заполните поле")
  .regex(time["mm:ss"].regexp, "Некорректное время");

const settingsSchema = z.object({
  prepareTime: timeSchema,
  presentationTime: timeSchema,
  defenseTime: timeSchema,
  timeoutTime: timeSchema,
  timeoutCount: z.number().nonnegative("Число должно быть положительным"),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export default memo(TourneyTimersSettings, () => true);
