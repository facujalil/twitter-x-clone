import React from "react";
import { Context } from "./Context";
import { useState } from "react";
import { ILoggedInUser } from "../types";

export const Provider = ({ children }: React.PropsWithChildren<{}>) => {
  const [loggedInUserData, setLoggedInUserData] = useState<ILoggedInUser>();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const value = {
    loggedInUserData,
    setLoggedInUserData,
    loginModalOpen,
    setLoginModalOpen,
    registerModalOpen,
    setRegisterModalOpen,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
