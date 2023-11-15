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
import CreateRequirementWindow from "./CreateRequirementWindow";
import EditRequirementWindow from "./EditRequirementWindow";

type Props = {
  value?: number[];
  onChange?: (newValue: number[]) => void;
} & Omit<InputProps, "value" | "onChange">;

const RequirementsInput = forwardRef<Props, "input">(
  ({ id, placeholder, value = [], onChange, ...props }, ref) => {
    const handleChange = (index: number) => (requirementId: number | null) => {
      if (requirementId === null) {
        onChange?.(value.filter((_, i) => i !== index));
      } else if (index === -1) {
        onChange?.([...value, requirementId]);
      } else {
        onChange?.(value.map((r, i) => (i == index ? requirementId : r)));
      }
    };

    return (
      <Box>
        <Stack key={JSON.stringify(mockOptions)} spacing={4}>
          {value.map((requirementId, i) => (
            <Select.Single
              key={i}
              placeholder={placeholder}
              value={requirementId}
              options={mockOptions}
              onChange={handleChange(i)}
              rightElement={
                <EditRequirementButton requirementId={requirementId} />
              }
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
        <CreateRequirementButton mx={1} mt={2} />
      </Box>
    );
  }
);

const mockOptions = [
  { label: "Древнее зло (Технологии прошлого)", value: 1 },
  { label: "Можно я посмотрю? (Метрики)", value: 2 },
  { label: "Зоопарк (Хранилище)", value: 3 },
];

const CreateRequirementButton = (props: ButtonProps) => {
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
      <CreateRequirementWindow
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

type EditRequirementButtonProps = {
  requirementId: number;
} & ButtonProps;

const EditRequirementButton = ({
  requirementId,
  ...props
}: EditRequirementButtonProps) => {
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
      <EditRequirementWindow
        {...window.getDisclosureProps()}
        requirementId={requirementId}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

export default RequirementsInput;
