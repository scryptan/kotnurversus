import {
  Input as BaseInput,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  InputProps,
  ListItem,
  ListProps,
  OrderedList,
  Text,
  forwardRef,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MouseEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import Alert from "~/components/Alert";
import IconButtonWithTooltip from "~/components/IconButtonWithTooltip";
import CrossIcon from "~/icons/CrossIcon";
import { TourneyTeam } from "~/types/tourney";

type BaseTeamCardProps = {
  team: Partial<TourneyTeam>;
} & BoxProps;

const BaseTeamCard = ({ team, ...props }: BaseTeamCardProps) => (
  <TeamCardLayout {...props}>
    <TeamCardTitle>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        noOfLines={1}
        wordBreak="break-all"
        children={team?.title || "???"}
      />
    </TeamCardTitle>
    <TeamCardMates>
      {team?.mates?.map((p, i) => (
        <ListItem ml={4} key={i} fontSize={{ base: "sm", md: "md" }}>
          <Text noOfLines={1} wordBreak="break-all" children={p} />
        </ListItem>
      ))}
      {!team?.mates?.length && (
        <Text
          py={{ base: 6, md: 10 }}
          opacity={0.75}
          textAlign="center"
          fontSize={{ base: "sm", md: "md" }}
          children="Участники не указаны"
        />
      )}
    </TeamCardMates>
  </TeamCardLayout>
);

type EditableTeamCardProps = {
  onChange?: (team: TourneyTeam) => void;
  onRemove?: (teamId: string) => void;
} & Omit<BaseTeamCardProps, "onChange">;

const EditableTeamCard = ({
  team,
  onChange,
  onRemove,
  ...props
}: EditableTeamCardProps) => {
  const { register, getValues, control, handleSubmit } = useForm<TeamSchema>({
    shouldFocusError: false,
    resolver: zodResolver(teamSchema),
    defaultValues: castToTeamSchema(team),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mates",
  });

  const handleChange = (data: TeamSchema) => {
    onChange?.(castToTeam(data, team));
  };

  const handleRemove = () => {
    team?.id && onRemove?.(team.id);
  };

  const handleAddMate = () => {
    remove(
      getValues("mates").flatMap(({ name }, i) => (name.trim() ? [] : [i]))
    );
    append({ name: "" });
  };

  return (
    <TeamCardLayout
      as="form"
      pos="relative"
      onChange={handleSubmit(handleChange)}
      {...props}
    >
      <TeamCardTitle>
        <Input
          h="42px"
          size="lg"
          maxLength={20}
          placeholder="Название команды"
          {...register("title")}
        />
      </TeamCardTitle>
      <TeamCardMates>
        {fields.map((field, i) => (
          <ListItem ml={4} key={field.id}>
            <Input
              h="24px"
              size="md"
              placeholder="Участник"
              {...register(`mates.${i}.name`)}
            />
          </ListItem>
        ))}
      </TeamCardMates>
      <AddMateButton onClick={handleAddMate} />
      {team?.id && onRemove && <RemoveButton onRemove={handleRemove} />}
    </TeamCardLayout>
  );
};

type ButtonTeamCardProps = {
  isChosen?: boolean;
  isDisabled?: boolean;
  activeColor: string;
  onChoose?: (teamId: string) => void;
} & BaseTeamCardProps;

const ButtonTeamCard = ({
  isChosen,
  isDisabled,
  activeColor,
  onChoose,
  onClick,
  team,
  ...props
}: ButtonTeamCardProps) => {
  const hoverProps = {
    borderColor: activeColor,
    _dark: { borderColor: activeColor },
  };
  const activeProps = {
    ...hoverProps,
    boxShadow: `0px 0px 20px 0px ${activeColor}`,
  };

  if (isDisabled) {
    return (
      <BaseTeamCard team={team} {...(isChosen ? activeProps : {})} {...props} />
    );
  }

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClick) return onClick(e);
    if (team.id) return onChoose?.(team.id);
  };

  return (
    <Box
      as="button"
      w="full"
      maxW={{ base: "175px", md: "250px" }}
      outline="none"
      textAlign="start"
      _hover={{ "#card": hoverProps }}
      _focusVisible={{ "#card": hoverProps }}
      onClick={handleClick}
      {...props}
    >
      <BaseTeamCard
        id="card"
        team={team}
        transition={["border", "box-shadow"]
          .map((x) => `${x} 200ms ease-out`)
          .join(", ")}
        {...(isChosen ? activeProps : {})}
      />
    </Box>
  );
};

const TeamCardLayout = forwardRef<BoxProps, "div">(
  ({ _dark, ...props }, ref) => (
    <Box
      ref={ref}
      maxW={{ base: "175px", md: "250px" }}
      w="full"
      h="fit-content"
      bg="blackAlpha.100"
      boxShadow="base"
      borderRadius={4}
      border="1px solid"
      borderColor="blackAlpha.400"
      _dark={{
        bg: "whiteAlpha.100",
        borderColor: "whiteAlpha.400",
        ..._dark,
      }}
      {...props}
    />
  )
);

const TeamCardTitle = (props: BoxProps) => (
  <Flex
    px={{ base: 2, md: 4 }}
    h={{ base: "32px", md: "42px" }}
    align="center"
    {...props}
  />
);

const TeamCardMates = (props: ListProps) => (
  <OrderedList
    m={0}
    px={{ base: 2, md: 4 }}
    py={{ base: 1.5, md: 2 }}
    spacing={1}
    borderTop="1px solid"
    borderColor="blackAlpha.400"
    _dark={{
      borderColor: "whiteAlpha.400",
    }}
    {...props}
  />
);

const Input = forwardRef<InputProps, "input">((props, ref) => (
  <BaseInput
    ref={ref}
    variant="flushed"
    border="none"
    _focusVisible={{ border: "none" }}
    {...props}
  />
));

const AddMateButton = (props: ButtonProps) => (
  <Button
    ml={8}
    mb={2}
    variant="link"
    colorScheme="blue"
    fontWeight="medium"
    children="Добавить"
    {...props}
  />
);

type RemoveButtonProps = {
  onRemove: () => void;
} & ButtonProps;

const RemoveButton = ({ onRemove, ...props }: RemoveButtonProps) => {
  const alert = useDisclosure();

  return (
    <>
      <IconButtonWithTooltip
        pos="absolute"
        right={-3}
        top={-3}
        size="xs"
        colorScheme="red"
        label="Удалить"
        borderRadius="full"
        onClick={alert.onOpen}
        icon={<CrossIcon boxSize={4} />}
        {...props}
      />
      <Alert
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        onSubmit={onRemove}
        children="Вы уверены, что хотите удалить данную команду?"
      />
    </>
  );
};

const teamSchema = z.object({
  title: z.string().min(1),
  mates: z.object({ name: z.string() }).array(),
});

type TeamSchema = z.infer<typeof teamSchema>;

const castToTeamSchema = (
  team?: Partial<TourneyTeam>
): Partial<TeamSchema> => ({
  title: team?.title,
  mates: team?.mates?.length
    ? team?.mates?.map((name) => ({ name }))
    : [{ name: "" }],
});

const castToTeam = (
  data: TeamSchema,
  team?: Partial<TourneyTeam>
): TourneyTeam => ({
  id: team?.id || uuid(),
  title: data.title,
  mates: data.mates.flatMap((p) => (p.name.trim() ? [p.name.trim()] : [])),
  order: team?.order || 0,
});

export default {
  Base: BaseTeamCard,
  Editable: EditableTeamCard,
  Button: ButtonTeamCard,
};
