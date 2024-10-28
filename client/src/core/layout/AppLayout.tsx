import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";
import { parseJwt } from "../utils/parseJwt";
import { getAuthUser } from "modules/users/api/users.api";
import { logout, setAuthUser } from "core/store/usersSlice";
import LoadingTwitterX from "core/components/LoadingTwitterX";
import LoginModal from "modules/auth/components/LoginModal";
import SignUpModal from "modules/auth/components/SignUpModal";
import PostModal from "modules/posts/components/PostModal";
import Sidebar from "./Sidebar/Sidebar";
import RecommendedUsers from "./RecommendedUsers";

function AppLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  const { token, authUser } = useSelector((state: RootState) => state.users);

  const { openModal } = useModalContext();

  const [appLoading, setAppLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      const authUserId = parseJwt(token).user_id;
      const tokenExpirationTime =
        parseJwt(token).exp * 1000 - new Date().getTime();

      let timeout: number | undefined;

      getAuthUser(authUserId)
        .then((data) => dispatch(setAuthUser(data)))
        .then(
          () =>
            (timeout = window.setTimeout(() => {
              dispatch(logout());
            }, tokenExpirationTime))
        )
        .catch((error) => console.error(error))
        .finally(() => setAppLoading(false));

      return () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
        }
      };
    }
  }, [token]);

  return appLoading ? (
    <LoadingTwitterX />
  ) : (
    <>
      {!authUser &&
        (openModal === "login" ? (
          <LoginModal setAppLoading={setAppLoading} />
        ) : openModal === "sign up" ? (
          <SignUpModal />
        ) : null)}
      {openModal === "post" ? <PostModal /> : null}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden max-w-[590px] min-h-screen border-x border-[#2f3336]">
        {children}
      </main>
      <div className="lg:hidden flex flex-col overflow-hidden w-[21.5rem] mt-4 bg-[#16181c] rounded-3xl">
        <h4 className="p-4 text-[1.3rem] font-bold">A quién seguir</h4>
        <RecommendedUsers />
      </div>
    </>
  );
}

export default AppLayout;
