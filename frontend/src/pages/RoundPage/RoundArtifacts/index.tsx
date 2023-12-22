import { BoxProps, Stack } from "@chakra-ui/react";
import { memo } from "react";
import CollapsibleSection from "~/components/CollapsibleSection";
import RoundDescription from "./RoundDescription";
import RoundGallery from "./RoundGallery";

const RoundArtifacts = (props: BoxProps) => (
  <CollapsibleSection
    label="Прикрепленные материалы"
    storageKey="round-artifacts-section"
    {...props}
  >
    <Stack mt={3} spacing={6}>
      <RoundGallery />
      <RoundDescription />
    </Stack>
  </CollapsibleSection>
);

export default memo(RoundArtifacts);
