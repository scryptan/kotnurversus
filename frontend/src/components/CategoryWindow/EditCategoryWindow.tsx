import { useId } from "react";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import Window, { WindowProps } from "~/components/Window";
import { Category, CreateCategory } from "~/types/category";
import CategoryForm, { CategoryFormSchema } from "./CategoryForm";

type Props = {
  category: Category;
  onSubmit?: (category: CreateCategory) => void;
  onRemove?: () => void;
};

const EditCategoryWindow = ({
  category,
  onSubmit,
  onRemove,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: CategoryFormSchema) => {
    onSubmit?.({ title: data.title, color: data.color });
  };

  return (
    <Window
      {...props}
      heading="Редактирование категории"
      contentProps={{ w: "450px" }}
      submitProps={{ type: "submit", form: formId }}
      extraButton={
        <ButtonWithAlert
          colorScheme="red"
          onSubmit={onRemove}
          isLoading={props.isLoading}
          buttonText="Удалить"
          alertText="Вы уверены, что хотите удалить данную категорию?"
        />
      }
    >
      <CategoryForm
        id={formId}
        defaultValue={category}
        onSubmit={handleSubmit}
      />
    </Window>
  );
};

export default EditCategoryWindow;
