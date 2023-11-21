import {
  Button,
  ButtonProps,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { memo, useState } from "react";
import { v4 as uuid } from "uuid";
import api from "~/api";
import SpecificationWindow from "~/components/SpecificationWindow";
import useDebounce from "~/hooks/useDebounce";
import {
  TourneySpecification,
  TourneySpecificationWithId,
} from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";
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
  const { isAuthenticated } = useAuthContext();
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

  if (!isAuthenticated) {
    return null;
  }

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
    <Stack spacing={6}>
      <Heading px={3} fontSize="3xl">
        Темы бизнес-сценариев
      </Heading>
      {specifications.length > 0 && (
        <SpecificationsList
          specifications={specifications}
          onUpdate={handleUpdate}
        />
      )}
      <CreateSpecificationButton ml={20} onCreate={handleCreate} />
    </Stack>
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
