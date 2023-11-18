import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import ScenarioForm, { ScenarioFormSchema } from "./ScenarioForm";
import { TourneyScenario } from "~/types/tourney";
import { Button, useDisclosure } from "@chakra-ui/react";
import Alert from "~/components/Alert";

type Props = {
  scenario: TourneyScenario;
  onSubmit?: (scenario: TourneyScenario) => void;
  onRemove?: () => void;
};

const EditScenarioWindow = ({
  scenario,
  onSubmit,
  onRemove,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const defaultValue = {
    name: scenario.name,
    description: scenario.description,
    requirements: scenario.requirements,
  };

  const handleSubmit = (data: ScenarioFormSchema) => {
    onSubmit?.({
      id: scenario.id,
      name: data.name,
      description: data.description,
      requirements: data.requirements,
    });
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Редактирование сценария"
      contentProps={{ w: "800px" }}
      submitProps={{ type: "submit", form: formId }}
      ExtraButton={() => <RemoveButton onRemove={onRemove} />}
    >
      <ScenarioForm
        id={formId}
        defaultValue={defaultValue}
        onSubmit={handleSubmit}
      />
    </Window>
  );
};

const RemoveButton = ({ onRemove }: Pick<Props, "onRemove">) => {
  const alert = useDisclosure();

  if (!onRemove) {
    return null;
  }

  return (
    <>
      <Button
        colorScheme="red"
        onClick={alert.onOpen}
        children="Удалить сценарий"
      />
      <Alert
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        onSubmit={onRemove}
        heading="Подтвердите действие"
        children="Вы уверены, что хотите удалить данный сценарий?"
      />
    </>
  );
};

export default EditScenarioWindow;
