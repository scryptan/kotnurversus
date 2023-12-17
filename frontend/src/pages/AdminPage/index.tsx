import { Center, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import Loading from "~/components/Loading";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import UsersTable from "~/pages/AdminPage/UsersTable";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

const AdminPage = () => {
  const { isAuthenticated } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: api.auth.findUsers,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || usersQuery.isLoading) {
    return <Loading flex={1} />;
  }

  if (usersQuery.isError || !usersQuery.data?.length) {
    return (
      <Center flex={1}>
        <Heading textAlign="center" fontSize={{ base: "xl", md: "3xl" }}>
          Не удалось загрузить пользователей
        </Heading>
      </Center>
    );
  }

  const users = usersQuery.data.sort((a, b) => a.email.localeCompare(b.email));

  return (
    <Stack px={4} flex={1} mx="auto" w="full" maxW="wrapper" spacing={6}>
      <Heading textAlign="center" fontSize={{ base: "xl", md: "4xl" }}>
        Профили пользователей
      </Heading>
      <UsersTable users={users} />
    </Stack>
  );
};

export default AdminPage;
