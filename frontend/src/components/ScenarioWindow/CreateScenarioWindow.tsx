import { useId } from "react";
import { v4 as uuid } from "uuid";
import Window, { WindowProps } from "~/components/Window";
import { TourneyScenario } from "~/types/tourney";
import ScenarioForm, { ScenarioFormSchema } from "./ScenarioForm";

type Props = {
  onSubmit?: (scenario: TourneyScenario) => void;
};

const CreateScenarioWindow = ({ onSubmit, ...props }: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: ScenarioFormSchema) => {
    onSubmit?.({
      id: uuid(),
      name: data.name,
      description: data.description,
      requirements: data.requirements,
    });
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Создание сценария"
      contentProps={{ w: "800px" }}
      submitProps={{ type: "submit", form: formId }}
    >
      <ScenarioForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default CreateScenarioWindow;
