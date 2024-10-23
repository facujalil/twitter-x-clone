import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IAuthUser } from "modules/users/types/userTypes";

type TOpenModal = "sign up" | "login" | "post" | "edit profile" | null;

interface IAppContext {
  authUser?: IAuthUser;
  setAuthUser: Dispatch<SetStateAction<IAuthUser | undefined>>;
  openModal: TOpenModal;
  setOpenModal: Dispatch<SetStateAction<TOpenModal>>;
  closeModal: () => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IAuthUser | undefined>(undefined);
  const [openModal, setOpenModal] = useState<TOpenModal>(null);

  const closeModal = () => {
    setOpenModal(null);
    document.body.style.overflowY = "visible";
  };

  const value = {
    authUser,
    setAuthUser,
    openModal,
    setOpenModal,
    closeModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};
