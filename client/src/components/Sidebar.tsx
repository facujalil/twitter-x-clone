import React, { useContext } from "react";
import { ILoggedInUser } from "../types";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { FaXTwitter } from "react-icons/fa6";
import NavItem from "./NavItem";
import { AiFillHome } from "react-icons/ai";
import { BsBellFill } from "react-icons/bs";
import { BiLogOut, BiSolidUser } from "react-icons/bi";
import { FaFeatherAlt } from "react-icons/fa";

interface Props {
  setPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ setPostModalOpen }: Props) {
  const navigate = useNavigate();

  const { loggedInUserData, setLoginModalOpen } = useContext(
    Context
  ) as IContext;

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate(0);
  };

  return (
    <div className="xl:px-2 flex flex-col items-start gap-[1.15rem] mt-4">
      <NavLink
        to="/"
        className="flex justify-center items-center aspect-square p-4 rounded-full transition hover:bg-[#181818]"
      >
        <FaXTwitter className="text-[1.8rem]" />
      </NavLink>

      <nav>
        <ul className="flex flex-col gap-[1.15rem]">
          <li className="xl:w-auto w-56">
            <NavLink
              to="/"
              className={`xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818] ${
                window.location.pathname === "/" && "font-medium"
              }`}
            >
              <AiFillHome className="text-[1.65rem]" />{" "}
              <span className="xl:hidden text-xl">Inicio</span>
            </NavLink>
          </li>
          <li className="xl:w-auto w-56">
            <NavItem
              privateRoute={true}
              to="/notifications"
              className={`xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818] ${
                loggedInUserId &&
                window.location.pathname === "/notifications" &&
                "font-medium"
              }`}
            >
              <div className="relative">
                {loggedInUserId &&
                  loggedInUserData.unread_notifications > 0 && (
                    <div className="absolute right-[-0.2rem] top-[-0.2rem] flex justify-center items-center min-w-4 h-4 bg-[#1d9bf0] border border-black rounded-full">
                      <span className="p-1 text-[0.55rem] font-bold">
                        {loggedInUserData.unread_notifications <= 20
                          ? loggedInUserData.unread_notifications
                          : "20+"}
                      </span>
                    </div>
                  )}{" "}
                <BsBellFill className="text-[1.65rem]" />
              </div>{" "}
              <span className="xl:hidden text-xl">Notificaciones</span>
            </NavItem>
          </li>
          <li className="xl:w-auto w-56">
            <NavItem
              privateRoute={true}
              to={`/users/${loggedInUserId}`}
              className={`xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818] ${
                loggedInUserId &&
                window.location.pathname === `/users/${loggedInUserId}` &&
                "font-medium"
              }`}
            >
              <BiSolidUser className="text-[1.65rem]" />{" "}
              <span className="xl:hidden text-xl">Perfil</span>
            </NavItem>
          </li>
          {loggedInUserId && (
            <li className="xl:w-auto w-56">
              <button
                className="xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 bg-transparent text-nowrap rounded-full transition hover:bg-[#181818]"
                onClick={logoutUser}
              >
                <BiLogOut className="text-[1.65rem]" />{" "}
                <span className="xl:hidden text-xl">Cerrar Sesión</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      <button
        className="xl:w-12 xl:h-12 xl:m-auto w-full p-3 bg-[#1d9bf0] font-medium text-nowrap rounded-full transition hover:opacity-90"
        onClick={() =>
          loggedInUserId ? setPostModalOpen(true) : setLoginModalOpen(true)
        }
      >
        <FaFeatherAlt className="xl:flex xl:m-auto hidden" />
        <span className="xl:hidden">Postear</span>
      </button>
    </div>
  );
}

export default Sidebar;
