import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import { CreateCategory } from "~/types/category";
import CategoryForm, { CategoryFormSchema } from "./CategoryForm";

type Props = {
  onSubmit?: (category: CreateCategory) => void;
};

const CreateCategoryWindow = ({ onSubmit, ...props }: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: CategoryFormSchema) => {
    onSubmit?.({ title: data.title, color: data.color });
  };

  return (
    <Window
      {...props}
      heading="Создание категории"
      contentProps={{ w: "450px" }}
      submitProps={{ type: "submit", form: formId }}
    >
      <CategoryForm id={formId} onSubmit={handleSubmit} />
    </Window>
  );
};

export default CreateCategoryWindow;
