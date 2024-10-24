import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";

interface Props {
  privateRoute?: boolean;
  to: string;
  children: ReactNode;
}

function NavItem({ privateRoute, to, children }: Props) {
  const location = useLocation();

  const authUserId = useSelector((state: RootState) => state.users.authUserId);

  const { setOpenModal } = useModalContext();

  return privateRoute && !authUserId ? (
    <button
      className="xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 text-nowrap rounded-full transition hover:bg-[#181818]"
      onClick={() => setOpenModal("login")}
    >
      {children}
    </button>
  ) : (
    <Link
      to={to}
      className={`${
        location.pathname === to ? "font-medium" : ""
      } xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 text-nowrap rounded-full transition hover:bg-[#181818]`}
    >
      {children}
    </Link>
  );
}

export default NavItem;
