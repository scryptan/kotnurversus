import {
  BoxProps,
  HStack,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useNumberInput,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import api from "~/api";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import useHandleError from "~/hooks/useHandleError";
import MinusIcon from "~/icons/MinusIcon";
import PlusIcon from "~/icons/PlusIcon";
import MainInfo from "~/pages/RoundPage/RoundStages/components/MainInfo";
import { getErrorApiStatus } from "~/utils/error";
import queryKeys from "~/utils/query-keys";
import { warningToast } from "~/utils/template-toasts";
import { useRoundContext } from "../round-context";
import TeamButton from "./components/TeamButton";

const MarkStage = () => {
  const toast = useToast();
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams } = useRoundContext();
  const marks = useRef<Record<string, number>>({});

  const finishRoundMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.finish(round.id, {
        marks: Object.entries(marks.current).map(([teamId, mark]) => ({
          teamId,
          mark,
        })),
      });
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: (error) => {
      if (getErrorApiStatus(error) === "sameMarks") {
        toast(warningToast("Никакой ничьи. Всегда должен быть победитель!"));
      } else {
        handleError(error);
      }
    },
  });

  const handleMark = (teamId: string) => (mark: number) => {
    marks.current = { ...marks.current, [teamId]: mark };
  };

  return (
    <>
      {getTeams().map((team, i) => (
        <TeamButton key={team?.id || i} gridArea={`t${i + 1}`} team={team} />
      ))}
      {isOrganizer &&
        round.participants
          .slice(0, 2)
          .map((p, i) => (
            <MarkInput
              key={p.teamId}
              gridArea={`e${i + 1}`}
              justifySelf={i === 0 ? "flex-end" : "flex-start"}
              onChange={handleMark(p.teamId)}
            />
          ))}
      <MainInfo children="Оценка команд" />
      {isOrganizer ? (
        <Stack align="center" gridArea="b">
          <Text textAlign="center" fontSize="md" lineHeight="150%">
            Выставите командам баллы
            <br />
            Когда будете готовы - завершите раунд
          </Text>
          <ButtonWithAlert
            closeBeforeSubmit
            colorScheme="teal"
            isLoading={finishRoundMutation.isPending}
            onSubmit={() => finishRoundMutation.mutateAsync()}
            buttonText="Завершить игру"
            alertText={[
              "Вы уверены, что хотите закончить раунд?",
              "Изменить результаты будет невозможно",
            ].join("\n")}
          />
        </Stack>
      ) : (
        <Heading
          gridArea="m"
          textAlign="center"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          Оценка команд
        </Heading>
      )}
    </>
  );
};

type MarkInputProps = {
  onChange?: (value: number) => void;
} & Omit<BoxProps, "onChange">;

const MarkInput = ({ onChange, ...props }: MarkInputProps) => {
  const {
    value,
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 99,
  });

  useEffect(() => {
    onChange?.(parseInt(value.trim()) || 0);
  }, [value]);

  return (
    <HStack {...props}>
      <IconButton
        {...getDecrementButtonProps()}
        px={0}
        size="sm"
        variant="ghost"
        colorScheme="red"
        borderRadius="full"
        icon={<MinusIcon boxSize={4} />}
        aria-label="Уменьшить"
      />
      <Input
        {...getInputProps()}
        maxLength={2}
        boxSize={16}
        borderRadius="full"
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
      />
      <IconButton
        {...getIncrementButtonProps()}
        px={0}
        size="sm"
        variant="ghost"
        colorScheme="green"
        borderRadius="full"
        icon={<PlusIcon boxSize={4} />}
        aria-label="Увеличить"
      />
    </HStack>
  );
};

export default MarkStage;
