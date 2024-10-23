import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "core/context/AppContext";
import { authUserId } from "core/utils/localStorage";

interface Props {
  privateRoute?: boolean;
  to: string;
  children: ReactNode;
}

function NavItem({ privateRoute, to, children }: Props) {
  const location = useLocation();

  const { setOpenModal } = useAppContext();

  return privateRoute && !authUserId ? (
    <button
      className="xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818]"
      onClick={() => setOpenModal("login")}
    >
      {children}
    </button>
  ) : (
    <Link
      to={to}
      className={`${
        location.pathname === to ? "font-medium" : ""
      } xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818]`}
    >
      {children}
    </Link>
  );
}

export default NavItem;
