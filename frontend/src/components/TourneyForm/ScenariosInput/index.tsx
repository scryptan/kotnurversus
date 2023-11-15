import {
  Box,
  Button,
  ButtonProps,
  Stack,
  forwardRef,
  useDisclosure,
} from "@chakra-ui/react";
import IconButtonWithTooltip from "~/components/IconButtonWithTooltip";
import { InputProps } from "~/components/Input";
import Select from "~/components/Select";
import PenIcon from "~/icons/PenIcon";
import CreateScenarioWindow from "./CreateScenarioWindow";
import EditScenarioWindow from "./EditScenarioWindow";

type Props = {
  value?: number[];
  onChange?: (newValue: number[]) => void;
} & Omit<InputProps, "value" | "onChange">;

const ScenariosInput = forwardRef<Props, "input">(
  ({ id, placeholder, value = [], onChange, ...props }, ref) => {
    const handleChange = (index: number) => (scenarioId: number | null) => {
      if (scenarioId === null) {
        onChange?.(value.filter((_, i) => i !== index));
      } else if (index === -1) {
        onChange?.([...value, scenarioId]);
      } else {
        onChange?.(value.map((s, i) => (i == index ? scenarioId : s)));
      }
    };

    return (
      <Box>
        <Stack key={JSON.stringify(mockOptions)} spacing={4}>
          {value.map((scenarioId, i) => (
            <Select.Single
              key={i}
              placeholder={placeholder}
              value={scenarioId}
              options={mockOptions}
              onChange={handleChange(i)}
              rightElement={<EditScenarioButton scenarioId={scenarioId} />}
              {...props}
            />
          ))}
          <Select.Single
            ref={ref}
            id={id}
            placeholder={placeholder}
            options={mockOptions}
            onChange={handleChange(-1)}
            {...props}
          />
        </Stack>
        <CreateScenarioButton mx={1} mt={2} />
      </Box>
    );
  }
);

const mockOptions = [
  { label: "Сервис самокатного шеринга", value: 1 },
  { label: "Сервис доставки еды", value: 2 },
  { label: "Прачечная с доставкой", value: 3 },
];

const CreateScenarioButton = (props: ButtonProps) => {
  const window = useDisclosure();

  return (
    <>
      <Button
        {...props}
        {...window.getButtonProps()}
        variant="link"
        colorScheme="blue"
        fontWeight="normal"
        children="Создать"
      />
      <CreateScenarioWindow
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

type EditScenarioButtonProps = {
  scenarioId: number;
} & ButtonProps;

const EditScenarioButton = ({
  scenarioId,
  ...props
}: EditScenarioButtonProps) => {
  const window = useDisclosure();

  return (
    <>
      <IconButtonWithTooltip
        {...props}
        {...window.getButtonProps()}
        size="xs"
        variant="ghost"
        icon={<PenIcon boxSize={5} />}
        onClick={window.onOpen}
        label="Редактировать"
      />
      <EditScenarioWindow
        {...window.getDisclosureProps()}
        scenarioId={scenarioId}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

export default ScenariosInput;
