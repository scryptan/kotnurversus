import { useId } from "react";
import { v4 as uuid } from "uuid";
import Window, { WindowProps } from "~/components/Window";
import { TourneySpecificationWithId } from "~/types/tourney";
import SpecificationForm, {
  SpecificationFormSchema,
} from "./SpecificationForm";

type Props = {
  onSubmit?: (specification: TourneySpecificationWithId) => void;
};

const CreateSpecificationWindow = ({
  onSubmit,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: SpecificationFormSchema) => {
    onSubmit?.({
      id: uuid(),
      title: data.title,
      businessDescription: data.businessDescription,
      techDescription: data.techDescription,
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
      <SpecificationForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default CreateSpecificationWindow;
