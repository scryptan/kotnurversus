import { BoxProps, Stack } from "@chakra-ui/react";
import { memo } from "react";
import CollapsibleSection from "~/components/CollapsibleSection";
import { useRoundContext } from "../round-context";
import RoundDescription from "./RoundDescription";
import RoundGallery from "./RoundGallery";

const RoundArtifacts = (props: BoxProps) => {
  const { isOrganizer, round } = useRoundContext();

  if (
    !(isOrganizer || round.artifacts.length || round.description?.trim().length)
  ) {
    return null;
  }

  return (
    <CollapsibleSection
      label="Прикрепленные материалы"
      storageKey="round-artifacts-section"
      {...props}
    >
      <Stack mt={3} spacing={6}>
        <RoundDescription />
        <RoundGallery />
      </Stack>
    </CollapsibleSection>
  );
};

export default memo(RoundArtifacts);
