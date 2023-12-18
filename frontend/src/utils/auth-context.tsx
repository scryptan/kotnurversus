import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { getUser } from "~/utils/auth";
import storage from "~/utils/storage";

type AuthContent = {
  isAuthenticated: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContent>({
  isAuthenticated: false,
  onLogin: () => {},
  onLogout: () => {},
});

export const TOKEN_STORAGE_KEY = "access-token";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getUser()?.isAuthorized || false
  );

  const context = useMemo(() => {
    const onLogin = (token: string) => {
      storage.set(TOKEN_STORAGE_KEY, token);
      setIsAuthenticated(true);
    };

    const onLogout = () => {
      storage.remove(TOKEN_STORAGE_KEY);
      setIsAuthenticated(false);
    };

    return { isAuthenticated, onLogin, onLogout };
  }, [isAuthenticated]);

  return <AuthContext.Provider value={context} children={children} />;
};

export const useAuthContext = (): AuthContent => useContext(AuthContext);
