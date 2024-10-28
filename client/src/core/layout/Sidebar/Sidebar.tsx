import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";
import { FaXTwitter } from "react-icons/fa6";
import NavItem from "./NavItem";
import { AiFillHome } from "react-icons/ai";
import { BsBellFill } from "react-icons/bs";
import { BiLogOut, BiSolidUser } from "react-icons/bi";
import { FaFeatherAlt } from "react-icons/fa";
import { logout } from "core/store/usersSlice";

function Sidebar() {
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.users.authUser);

  const { setOpenModal } = useModalContext();

  return (
    <div className="xl:px-2 flex flex-col items-start gap-[1.15rem] mt-4">
      <Link
        to="/"
        className="flex justify-center items-center aspect-square p-4 rounded-full transition hover:bg-[#181818]"
      >
        <FaXTwitter className="text-[1.8rem]" />
      </Link>
      <nav>
        <ul className="flex flex-col gap-[1.15rem]">
          <li className="xl:w-auto w-56">
            <NavItem to="/">
              <AiFillHome className="text-[1.65rem]" />{" "}
              <span className="xl:hidden text-xl">Inicio</span>
            </NavItem>
          </li>
          <li className="xl:w-auto w-56">
            <NavItem privateRoute to="/notifications">
              <div className="relative">
                {authUser && authUser.unread_notifications > 0 ? (
                  <div className="absolute right-[-0.2rem] top-[-0.2rem] flex justify-center items-center min-w-4 h-4 bg-[#1d9bf0] border border-black rounded-full">
                    <span className="p-1 text-[0.55rem] font-bold">
                      {authUser.unread_notifications <= 20
                        ? authUser.unread_notifications
                        : "20+"}
                    </span>
                  </div>
                ) : null}
                <BsBellFill className="text-[1.65rem]" />
              </div>{" "}
              <span className="xl:hidden text-xl">Notificaciones</span>
            </NavItem>
          </li>
          <li className="xl:w-auto w-56">
            <NavItem privateRoute to={`/users/${authUser?.user_id}`}>
              <BiSolidUser className="text-[1.65rem]" />{" "}
              <span className="xl:hidden text-xl">Perfil</span>
            </NavItem>
          </li>
          {authUser ? (
            <li className="xl:w-auto w-56">
              <button
                className="xl:aspect-square xl:p-4 xl:rounded-full inline-flex items-center gap-4 py-3 px-4 text-nowrap rounded-full transition hover:bg-[#181818]"
                onClick={() => {
                  dispatch(logout());
                  localStorage.removeItem("token");
                }}
              >
                <BiLogOut className="text-[1.65rem]" />{" "}
                <span className="xl:hidden text-xl">Cerrar Sesión</span>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
      <button
        className="xl:w-12 xl:h-12 xl:m-auto w-full p-3 bg-[#1d9bf0] font-medium text-nowrap rounded-full transition hover:opacity-90"
        onClick={() => setOpenModal(authUser?.user_id ? "post" : "login")}
      >
        <FaFeatherAlt className="xl:flex xl:m-auto hidden" />
        <span className="xl:hidden">Postear</span>
      </button>
    </div>
  );
}

export default Sidebar;
