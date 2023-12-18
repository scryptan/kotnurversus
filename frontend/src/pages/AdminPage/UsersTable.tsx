import {
  BoxProps,
  Grid,
  GridProps,
  Stack,
  Switch,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { memo, useState } from "react";
import api from "~/api";
import { User } from "~/types/auth";
import { getUser } from "~/utils/auth";

type Props = {
  users: User[];
} & BoxProps;

const UsersTable = ({ users, ...props }: Props) => (
  <Stack {...props} spacing={0.5}>
    <HeaderRow mb={2} />
    {users.map((u) => (
      <BodyRow key={u.id} user={u} />
    ))}
  </Stack>
);

const HeaderRow = (props: GridProps) => (
  <Grid
    {...props}
    gridTemplateColumns={{ base: "1fr 110px", md: "1fr 200px" }}
    fontSize={{ base: "xs", md: "sm" }}
  >
    <HeaderCell>Логин</HeaderCell>
    <HeaderCell textAlign="center">Организатор</HeaderCell>
  </Grid>
);

type BodyRowProps = {
  user: User;
};

const BodyRow = memo(
  ({ user }: BodyRowProps) => (
    <Grid
      gridTemplateColumns={{ base: "1fr 110px", md: "1fr 200px" }}
      gridAutoRows={{ base: "50px", md: "64px" }}
      fontSize={{ base: "sm", md: "lg" }}
      bg="blackAlpha.50"
      alignItems="center"
      _hover={{ bg: "blackAlpha.100" }}
      _dark={{
        bg: "whiteAlpha.50",
        _hover: { bg: "whiteAlpha.100" },
      }}
    >
      <BodyCell>{user.email}</BodyCell>
      <OrganizerSwitch isSelf={user?.id === getUser()?.id} user={user} />
    </Grid>
  ),
  (prev, next) => prev.user.id === next.user.id
);

const HeaderCell = (props: TextProps) => (
  <Text px={{ base: 2, md: 8 }} color="#909090" {...props} />
);

const BodyCell = (props: TextProps) => (
  <Text
    px={{ base: 4, md: 8 }}
    noOfLines={1}
    wordBreak="break-all"
    {...props}
  />
);

type OrganizerSwitchProps = {
  user: User;
  isSelf?: boolean;
};

const OrganizerSwitch = ({ user, isSelf }: OrganizerSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(user.isAuthorized);

  const setAuthorized = useMutation({
    mutationFn: async () => {
      return await api.auth.setAuthorized(user.id, !isEnabled);
    },
    onSuccess: (user) => {
      setIsEnabled(user.isAuthorized);
    },
  });

  return (
    <BodyCell py={1} textAlign="center">
      <Switch
        isChecked={isEnabled}
        isDisabled={isSelf || setAuthorized.isPending}
        size={{ base: "md", md: "lg" }}
        onChange={() => setAuthorized.mutateAsync()}
      />
    </BodyCell>
  );
};

export default UsersTable;
