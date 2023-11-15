import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import ScenarioForm, { ScenarioFormSchema } from "./ScenarioForm";

type Props = {
  scenarioId: number;
};

const EditScenarioWindow = ({ scenarioId, ...props }: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: ScenarioFormSchema) => {
    console.log(scenarioId, data);
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Редактирование сценария"
      contentProps={{ w: "800px", onSubmit: (e) => e.stopPropagation() }}
      submitProps={{ type: "submit", form: formId }}
    >
      <ScenarioForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default EditScenarioWindow;
