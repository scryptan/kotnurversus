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
import { MatchTask } from "~/types/match";
import { createArrayFromMatchTask } from "~/utils/match";

type Props = {
  task: MatchTask;
};

const MatchTaskSection = ({ task }: Props) => {
  const items = createArrayFromMatchTask(task);

  if (items.length === 0) {
    return null;
  }

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

export default MatchTaskSection;
