import { useId } from "react";
import Window, { WindowProps } from "~/components/Window";
import ChallengeForm, { ChallengeFormSchema } from "./ChallengeForm";
import { CreateChallenge } from "~/types/challenge";

type Props = {
  defaultCategoryId?: string;
  onSubmit?: (data: CreateChallenge) => void;
};

const CreateChallengeWindow = ({
  defaultCategoryId,
  onSubmit,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: ChallengeFormSchema) => {
    onSubmit?.({
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      isCatInBag: data.isCatInBag,
    });
  };

  return (
    <Window
      {...props}
      heading="Создание дополнительного требования"
      contentProps={{ w: "675px" }}
      submitProps={{ type: "submit", form: formId }}
    >
      <ChallengeForm
        id={formId}
        defaultValue={{ categoryId: defaultCategoryId }}
        onSubmit={handleSubmit}
      />
    </Window>
  );
};

export default CreateChallengeWindow;
