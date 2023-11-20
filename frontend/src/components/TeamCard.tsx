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
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import IconButtonWithTooltip from "~/components/IconButtonWithTooltip";
import CrossIcon from "~/icons/CrossIcon";
import { Team } from "~/types/team";

type Props = {
  isEditMode?: boolean;
  team?: Partial<Team>;
  onChange?: (team: Team) => void;
  onRemove?: (teamId: string) => void;
} & Omit<BoxProps, "onChange">;

const TeamCard = ({
  isEditMode,
  team,
  onChange,
  onRemove,
  ...props
}: Props) => {
  if (isEditMode) {
    return (
      <EditableTeamCard
        team={team}
        onChange={onChange}
        onRemove={onRemove}
        {...props}
      />
    );
  }

  return <BaseTeamCard team={team} {...props} />;
};

const BaseTeamCard = ({
  team,
  ...props
}: Omit<Props, "isEditMode" | "onChange" | "onRemove">) => (
  <TeamCardLayout {...props}>
    <TeamCardName>
      <Text
        fontSize="2xl"
        noOfLines={1}
        wordBreak="break-all"
        children={team?.name || "Команда"}
      />
    </TeamCardName>
    <TeamCardParticipants>
      {team?.participants?.map((p, i) => (
        <ListItem ml={4} key={i}>
          <Text noOfLines={1} wordBreak="break-all" children={p} />
        </ListItem>
      ))}
    </TeamCardParticipants>
  </TeamCardLayout>
);

const EditableTeamCard = ({ team, onChange, onRemove, ...props }: Props) => {
  const { register, getValues, control, handleSubmit } = useForm<TeamSchema>({
    shouldFocusError: false,
    resolver: zodResolver(teamSchema),
    defaultValues: castToTeamSchema(team),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const handleChange = (data: TeamSchema) => {
    onChange?.(castToTeam(data, team?.id));
  };

  const handleRemove = () => {
    team?.id && onRemove?.(team.id);
  };

  const handleAddParticipant = () => {
    remove(
      getValues("participants").flatMap(({ name }, i) =>
        name.trim() ? [] : [i]
      )
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
      <TeamCardName>
        <Input
          h="42px"
          size="lg"
          placeholder="Название команды"
          {...register("name")}
        />
      </TeamCardName>
      <TeamCardParticipants>
        {fields.map((field, i) => (
          <ListItem ml={4} key={field.id}>
            <Input
              h="24px"
              size="md"
              placeholder="Участник"
              {...register(`participants.${i}.name`)}
            />
          </ListItem>
        ))}
      </TeamCardParticipants>
      <AddParticipantButton onClick={handleAddParticipant} />
      {team?.id && onRemove && <RemoveButton onClick={handleRemove} />}
    </TeamCardLayout>
  );
};

const TeamCardLayout = forwardRef<BoxProps, "div">((props, ref) => (
  <Box
    ref={ref}
    w="250px"
    h="fit-content"
    bg="blackAlpha.100"
    boxShadow="base"
    borderRadius={4}
    border="1px solid"
    borderColor="blackAlpha.400"
    _dark={{
      bg: "whiteAlpha.100",
      borderColor: "whiteAlpha.400",
    }}
    {...props}
  />
));

const TeamCardName = (props: BoxProps) => (
  <Flex px={4} h="42px" align="center" {...props} />
);

const TeamCardParticipants = (props: ListProps) => (
  <OrderedList
    m={0}
    px={4}
    py={2}
    spacing={1}
    borderTop="1px solid"
    borderColor="inherit"
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

const AddParticipantButton = (props: ButtonProps) => (
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

const RemoveButton = (props: ButtonProps) => (
  <IconButtonWithTooltip
    pos="absolute"
    right={-3}
    top={-3}
    size="xs"
    colorScheme="red"
    label="Удалить"
    borderRadius="full"
    icon={<CrossIcon boxSize={4} />}
    {...props}
  />
);

const teamSchema = z.object({
  name: z.string().min(1),
  participants: z.object({ name: z.string() }).array(),
});

type TeamSchema = z.infer<typeof teamSchema>;

const castToTeamSchema = (team?: Partial<Team>): Partial<TeamSchema> => ({
  name: team?.name,
  participants: team?.participants?.length
    ? team?.participants?.map((name) => ({ name }))
    : [{ name: "" }],
});

const castToTeam = (data: TeamSchema, teamId?: string): Team => ({
  id: teamId || uuid(),
  name: data.name,
  participants: data.participants.flatMap((p) =>
    p.name.trim() ? [p.name.trim()] : []
  ),
});

export default TeamCard;
