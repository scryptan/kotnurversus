import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import RequirementForm, { RequirementFormSchema } from "./RequirementForm";

const CreateRequirementWindow = (props: WindowProps) => {
  const formId = useId();

  const handleSubmit = (data: RequirementFormSchema) => {
    console.log(data);
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Создание дополнительного требования"
      contentProps={{ w: "675px", onSubmit: (e) => e.stopPropagation() }}
      submitProps={{ type: "submit", form: formId }}
    >
      <RequirementForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default CreateRequirementWindow;
