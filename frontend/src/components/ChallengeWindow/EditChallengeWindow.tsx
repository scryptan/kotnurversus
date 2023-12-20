import { useId } from "react";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import Window, { WindowProps } from "~/components/Window";
import { Challenge, CreateChallenge } from "~/types/challenge";
import ChallengeForm, { ChallengeFormSchema } from "./ChallengeForm";

type Props = {
  challenge: Challenge;
  onSubmit?: (data: CreateChallenge) => void;
  onRemove?: () => void;
};

const EditChallengeWindow = ({
  challenge,
  onSubmit,
  onRemove,
  ...props
}: WindowProps<Props>) => {
  const formId = useId();

  const handleSubmit = (data: ChallengeFormSchema) => {
    onSubmit?.({
      categoryId: data.categoryId,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      isCatInBag: data.isCatInBag,
    });
  };

  return (
    <Window
      {...props}
      heading="Редактирование дополнительного требования"
      contentProps={{ w: "675px" }}
      submitProps={{ type: "submit", form: formId }}
      extraButton={
        <ButtonWithAlert
          colorScheme="red"
          onSubmit={onRemove}
          isLoading={props.isLoading}
          buttonText="Удалить"
          alertText="Вы уверены, что хотите удалить данное дополнительное требование?"
        />
      }
    >
      <ChallengeForm
        id={formId}
        defaultValue={challenge}
        onSubmit={handleSubmit}
      />
    </Window>
  );
};

export default EditChallengeWindow;
