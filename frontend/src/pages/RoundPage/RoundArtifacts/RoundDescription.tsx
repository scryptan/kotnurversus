import { Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { ChangeEvent, useMemo, useRef } from "react";
import api from "~/api";
import AutoLinkWrapper from "~/components/AutoLinkWrapper";
import AutoSizeTextarea from "~/components/AutoSizeTextarea";
import useDebounce from "~/hooks/useDebounce";
import useHandleError from "~/hooks/useHandleError";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";

const RoundDescription = () => {
  const { isOrganizer, round } = useRoundContext();

  const component = useMemo(() => {
    const Description = isOrganizer ? EditableDescription : ReadonlyDescription;

    return <Description roundId={round.id} description={round.description} />;
  }, [isOrganizer, round.id, round.description]);

  return component;
};

type Props = {
  roundId: string;
  description?: string;
};

const ReadonlyDescription = ({ description }: Props) => (
  <AutoLinkWrapper>
    <Text
      whiteSpace="pre-line"
      fontSize={{ base: "sm", md: "md" }}
      lineHeight="150%"
      children={description}
    />
  </AutoLinkWrapper>
);

const EditableDescription = ({ roundId, description }: Props) => {
  const debounce = useDebounce(300);
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateDescription = useMutation({
    mutationFn: async (newDescription: string) => {
      const operations = compare({}, { description: newDescription });
      return await api.rounds.patch(roundId, operations);
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.currentTarget.value.trim();
    debounce.set(() => updateDescription.mutateAsync(newDescription));
  };

  return (
    <AutoSizeTextarea
      ref={textareaRef}
      defaultValue={description}
      onChange={handleChange}
      placeholder="Введите описание для игры"
    />
  );
};

export default RoundDescription;
