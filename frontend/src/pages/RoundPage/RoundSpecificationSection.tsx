import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Heading,
  Text,
} from "@chakra-ui/react";
import { createArrayFromSpecification } from "~/utils/round";
import { useRoundContext } from "./round-context";

const RoundSpecificationSection = (props: BoxProps) => {
  const { isPublic, round } = useRoundContext();

  if (!isPublic) return null;
  const items = createArrayFromSpecification(round.specification);
  if (items.length < 1) return null;

  return (
    <Box {...props}>
      <Heading
        mb={4}
        fontSize={{ base: "md", md: "3xl" }}
        textAlign={{ base: "center", md: "left" }}
        children="Описание задачи"
      />

      <Accordion allowMultiple>
        {items.map((item, i) => (
          <AccordionItem key={i}>
            <AccordionButton py={3}>
              <Text
                as="span"
                flex={1}
                textAlign="left"
                fontSize={{ base: "sm", md: "md" }}
                children={item.name}
              />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              p={4}
              pt={2}
              color="blackAlpha.700"
              fontSize={{ base: "sm", md: "md" }}
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
