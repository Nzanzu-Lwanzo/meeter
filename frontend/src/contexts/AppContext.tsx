import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type User } from "../utils/@types";
import { lsRead } from "../lib/ls.io";

export interface AppContextType {
  auth: User | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  return useContext(AppContext)!;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User | undefined>(undefined);

  useEffect(() => {
    const _auth = lsRead<User>("meeterAuth");
    setAuth(_auth);
  }, []);

  const value = {
    auth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
