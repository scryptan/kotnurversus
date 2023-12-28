import { BoxProps, Text } from "@chakra-ui/react";
import CollapsibleSection from "~/components/CollapsibleSection";
import { useRoundContext } from "./round-context";

const RoundSpecificationSection = (props: BoxProps) => {
  const { isPublic, round } = useRoundContext();

  const text = round.specification?.techDescription?.trim() || "";

  if (!isPublic || text.length < 1) return null;

  return (
    <CollapsibleSection
      label="Общие требования к архитектуре"
      storageKey="round-specification-section"
      {...props}
    >
      <Text
        mt={3}
        fontSize={{ base: "sm", md: "md" }}
        lineHeight="150%"
        whiteSpace="pre-line"
        children={round.specification?.techDescription}
      />
    </CollapsibleSection>
  );
};

export default RoundSpecificationSection;
