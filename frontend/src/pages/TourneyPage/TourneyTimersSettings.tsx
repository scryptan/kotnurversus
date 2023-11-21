import { HStack, Heading, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { FormEvent, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "~/api";
import Input, { InputProps } from "~/components/Input";
import useDebounce from "~/hooks/useDebounce";
import { TourneySettings } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

type Props = {
  id: string;
  settings: TourneySettings;
};

const TourneyTimersSettings = ({ id, settings }: Props) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsSchema>({
    shouldFocusError: false,
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const editTourney = useMutation({
    mutationFn: async (newSettings: TourneySettings) => {
      const operations = compare({ settings }, { settings: newSettings });
      return await api.tourneys.patch(id, operations);
    },
    onSuccess: async (tourney) => {
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    debounce.set(() => editTourney.mutateAsync({ ...settings, ...data }));
  });

  return (
    <Stack spacing={6}>
      <Heading px={3} fontSize="3xl">
        Настройки таймера
      </Heading>
      <HStack as="form" spacing="124px" align="flex-start" onChange={onSubmit}>
        <SecondsInput
          label="Подготовка"
          {...register("prepareSeconds")}
          errorMessage={errors.prepareSeconds?.message}
        />
        <SecondsInput
          label="Презентация"
          {...register("presentationSeconds")}
          errorMessage={errors.presentationSeconds?.message}
        />
        <SecondsInput
          label="Защита"
          {...register("defenseSeconds")}
          errorMessage={errors.defenseSeconds?.message}
        />
      </HStack>
    </Stack>
  );
};

const SecondsInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  };

  return (
    <Input
      ref={ref}
      {...props}
      maxLength={5}
      rightAddon="сек"
      onInput={handleInput}
      containerProps={{ w: "150px" }}
    />
  );
});

const settingsSchema = z.object({
  prepareSeconds: z.coerce.number().min(1, "Заполните поле"),
  presentationSeconds: z.coerce.number().min(1, "Заполните поле"),
  defenseSeconds: z.coerce.number().min(1, "Заполните поле"),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export default TourneyTimersSettings;
