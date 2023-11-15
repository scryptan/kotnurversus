import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import ScenarioForm, { ScenarioFormSchema } from "./ScenarioForm";

const CreateScenarioWindow = (props: WindowProps) => {
  const formId = useId();

  const handleSubmit = (data: ScenarioFormSchema) => {
    console.log(data);
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Создание сценария"
      contentProps={{ w: "800px", onSubmit: (e) => e.stopPropagation() }}
      submitProps={{ type: "submit", form: formId }}
    >
      <ScenarioForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default CreateScenarioWindow;
