import { useId } from "react";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import Window, { WindowProps } from "~/components/Window";
import { TourneyScenario } from "~/types/tourney";
import ScenarioForm, { ScenarioFormSchema } from "./ScenarioForm";

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
      ExtraButton={() => (
        <ButtonWithAlert
          colorScheme="red"
          onSubmit={onRemove}
          buttonText="Удалить сценарий"
          alertText="Вы уверены, что хотите удалить данный сценарий?"
        />
      )}
    >
      <ScenarioForm
        id={formId}
        defaultValue={defaultValue}
        onSubmit={handleSubmit}
      />
    </Window>
  );
};

export default EditScenarioWindow;
