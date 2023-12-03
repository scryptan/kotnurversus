import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { memo, useState } from "react";
import { v4 as uuid } from "uuid";
import api from "~/api";
import SpecificationWindow from "~/components/SpecificationWindow";
import useDebounce from "~/hooks/useDebounce";
import TourneySectionLayout from "~/pages/TourneyPage/TourneySectionLayout";
import {
  TourneySpecification,
  TourneySpecificationWithId,
} from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import { useTourneyContext } from "../tourney-context";
import SpecificationsList from "./SpecificationsList";

type Props = {
  id: string;
  specifications: TourneySpecification[];
};

const TourneySpecificationsSettings = ({
  id,
  specifications: defaultSpecifications,
}: Props) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const { isEditable } = useTourneyContext();
  const [specifications, setSpecifications] = useState(() =>
    defaultSpecifications.map<TourneySpecificationWithId>((specification) => ({
      ...specification,
      id: uuid(),
    }))
  );

  const editSpecifications = useMutation({
    mutationFn: async (specifications: TourneySpecificationWithId[]) => {
      const operations = compare({}, { specifications });
      return await api.tourneys.patch(id, operations);
    },
    onSuccess: async (tourney) => {
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
    },
  });

  if (!isEditable) return null;

  const handleUpdate = (
    callback: (
      oldSpecifications: TourneySpecificationWithId[]
    ) => TourneySpecificationWithId[]
  ) => {
    setSpecifications((specifications) => {
      const updated = callback(specifications);
      debounce.set(() => editSpecifications.mutateAsync(updated));
      return updated;
    });
  };

  const handleCreate = (specification: TourneySpecificationWithId) => {
    handleUpdate((specifications) => [...specifications, specification]);
  };

  return (
    <TourneySectionLayout
      defaultIsOpen
      heading="Темы бизнес-сценариев"
      storageKey={`tourney:${id}:specifications-visibility `}
    >
      {specifications.length > 0 && (
        <SpecificationsList
          mt={6}
          specifications={specifications}
          onUpdate={handleUpdate}
        />
      )}
      <CreateSpecificationButton ml={20} mt={6} onCreate={handleCreate} />
    </TourneySectionLayout>
  );
};

type CreateSpecificationButtonProps = {
  onCreate: (specification: TourneySpecificationWithId) => void;
} & ButtonProps;

const CreateSpecificationButton = ({
  onCreate,
  ...props
}: CreateSpecificationButtonProps) => {
  const window = useDisclosure();

  const handleSubmit = (specification: TourneySpecificationWithId) => {
    onCreate(specification);
    window.onClose();
  };

  return (
    <>
      <Button
        {...props}
        {...window.getButtonProps()}
        w="fit-content"
        variant="link"
        colorScheme="blue"
        onClick={window.onOpen}
        children="Добавить"
      />
      <SpecificationWindow.Create
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default memo(TourneySpecificationsSettings, () => true);
