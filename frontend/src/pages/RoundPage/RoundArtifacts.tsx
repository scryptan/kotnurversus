import { BoxProps, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { ChangeEvent, memo, useRef } from "react";
import api from "~/api";
import AutoLinkWrapper from "~/components/AutoLinkWrapper";
import AutoSizeTextarea from "~/components/AutoSizeTextarea";
import CollapsibleSection from "~/components/CollapsibleSection";
import useDebounce from "~/hooks/useDebounce";
import useHandleError from "~/hooks/useHandleError";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "./round-context";

const RoundArtifacts = (props: BoxProps) => {
  const { isOrganizer, round } = useRoundContext();

  const Description = isOrganizer ? EditableDescription : DescriptionBlock;

  return (
    <CollapsibleSection
      label="Прикрепленные материалы"
      storageKey="round-artifacts-section"
      {...props}
    >
      <Stack mt={6} spacing={6}>
        <Description roundId={round.id} description={round.description} />
      </Stack>
    </CollapsibleSection>
  );
};

type DescriptionProps = {
  roundId: string;
  description?: string;
};

const DescriptionBlock = ({ description }: DescriptionProps) => (
  <AutoLinkWrapper>
    <Text whiteSpace="pre-line" lineHeight="150%" children={description} />
  </AutoLinkWrapper>
);

const EditableDescription = ({ roundId, description }: DescriptionProps) => {
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
    />
  );
};

export default memo(RoundArtifacts);
