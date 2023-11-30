import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { createArrayFromSpecification } from "~/utils/round";
import { useRoundContext } from "./round-context";

const RoundSpecificationSection = () => {
  const { round } = useRoundContext();
  const items = createArrayFromSpecification(round.specification);

  if (items.length < 1) return null;

  return (
    <Box>
      <Heading mb={4} fontSize="3xl">
        Описание задачи
      </Heading>
      <Accordion allowMultiple>
        {items.map((item, i) => (
          <AccordionItem key={i}>
            <AccordionButton py={3}>
              <Text as="span" flex={1} textAlign="left" children={item.name} />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              p={4}
              pt={2}
              color="blackAlpha.700"
              whiteSpace="pre-line"
              children={item.text.trim()}
              _dark={{ color: "whiteAlpha.700" }}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default RoundSpecificationSection;
