import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TOpenModal = "sign up" | "login" | "post" | "edit profile";

interface IModalContext {
  openModal: TOpenModal | null;
  setOpenModal: Dispatch<SetStateAction<TOpenModal | null>>;
  closeModal: () => void;
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<TOpenModal | null>(null);

  const closeModal = () => {
    setOpenModal(null);
    document.body.style.overflowY = "visible";
  };

  const value = {
    openModal,
    setOpenModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }

  return context;
};
