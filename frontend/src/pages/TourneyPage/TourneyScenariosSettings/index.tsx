import {
  Button,
  ButtonProps,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ScenariosList from "./ScenariosList";
import { useAuthContext } from "~/utils/auth-context";
import { TourneyScenario } from "~/types/tourney";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import ScenarioWindow from "~/components/ScenarioWindow";

type Props = {
  tourneyId: string;
};

const TourneyScenariosSettings = ({ tourneyId: _ }: Props) => {
  const { isAuthenticated } = useAuthContext();
  const [scenarios, setScenarios] = useState(mockScenarios);

  if (!isAuthenticated) {
    return null;
  }

  const handleCreate = (scenario: TourneyScenario) => {
    setScenarios((scenarios) => [...scenarios, scenario]);
  };

  return (
    <Stack spacing={6}>
      <Heading px={3} fontSize="3xl">
        Темы бизнес-сценариев
      </Heading>
      {scenarios.length > 0 && (
        <ScenariosList scenarios={scenarios} onUpdate={setScenarios} />
      )}
      <CreateScenarioButton ml={20} onCreate={handleCreate} />
    </Stack>
  );
};

type CreateScenarioButtonProps = {
  onCreate: (scenario: TourneyScenario) => void;
} & ButtonProps;

const CreateScenarioButton = ({
  onCreate,
  ...props
}: CreateScenarioButtonProps) => {
  const window = useDisclosure();

  const handleSubmit = (scenario: TourneyScenario) => {
    onCreate(scenario);
    window.onClose();
  };

  return (
    <>
      <Button
        {...props}
        {...window.getButtonProps()}
        w="fit-content"
        colorScheme="blue"
        variant="link"
        onClick={window.onOpen}
        children="Добавить"
      />
      <ScenarioWindow.Create
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

const mockScenarios: TourneyScenario[] = [
  {
    id: uuid(),
    name: "Сервис самокатного шеринга",
    description: `
    Сервис для самостоятельно аренды самокатов по городу. Функциональный аналог Whoosh и др.
    Вводные данные
    — 100 млн поездок в год
    — Парк из 150 000 самокатов
    — Сервис охватывает несколько стран (Россия и ближнее зарубежье)
    `.trim(),
    requirements: `
    — При проектировании постараться использовать оптимальное количество ресурсов и не изобретать серебряную пулю. Недостаточно использовать условный Houston или Kubernetes — нужно явно обозначить, какие фичи требуются. Выбор технологий должен быть аргументированным.
    — Архитектура должна обеспечить работу основных сценариев и удовлетворять заданным требованиям.
    — 100-200мс на осмысленный ответ клиенту (важно: речь не про завершение сценария, а именно про успешный HTTP-ответ).
    `.trim(),
  },
  {
    id: uuid(),
    name: "Сервис доставки еды",
  },
  {
    id: uuid(),
    name: "Прачечная с доставкой",
  },
];

export default TourneyScenariosSettings;
