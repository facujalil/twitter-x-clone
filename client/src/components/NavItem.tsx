import React, { PropsWithChildren, useContext } from "react";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { NavLink } from "react-router-dom";

interface Props extends PropsWithChildren {
  privateRoute?: boolean;
  to: string;
  className: string;
}

interface IContext {
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavItem({ privateRoute, to, className, children }: Props) {
  const { setLoginModalOpen } = useContext(Context) as IContext;

  return privateRoute && !loggedInUserId ? (
    <button className={className} onClick={() => setLoginModalOpen(true)}>
      {children}
    </button>
  ) : (
    <NavLink to={to} className={className}>
      {children}
    </NavLink>
  );
}

export default NavItem;
