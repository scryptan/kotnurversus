import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import RequirementForm, { RequirementFormSchema } from "./RequirementForm";

type Props = {
  requirementId: number;
};

const EditRequirementWindow = ({
  requirementId,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: RequirementFormSchema) => {
    console.log(requirementId, data);
    props.onClose();
  };

  return (
    <Window
      {...props}
      heading="Редактирование дополнительного требования"
      contentProps={{ w: "675px", onSubmit: (e) => e.stopPropagation() }}
      submitProps={{ type: "submit", form: formId }}
    >
      <RequirementForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default EditRequirementWindow;
