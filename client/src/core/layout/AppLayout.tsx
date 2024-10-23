import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "core/context/AppContext";
import { authUserId, token } from "../utils/localStorage";
import { parseJwt } from "../utils/parseJwt";
import { getAuthUser } from "modules/users/api/users.api";
import LoadingTwitterX from "core/components/LoadingTwitterX";
import LoginModal from "modules/auth/components/LoginModal";
import SignUpModal from "modules/auth/components/SignUpModal";
import PostModal from "modules/posts/components/PostModal";
import Sidebar from "./Sidebar/Sidebar";
import RecommendedUsers from "./RecommendedUsers";

function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const { authUser, setAuthUser, openModal } = useAppContext();

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (authUserId && token) {
      let timeout: number | undefined;
      const tokenExpirationTime =
        parseJwt(token).exp * 1000 - new Date().getTime();

      getAuthUser(authUserId)
        .then((data) => setAuthUser(data))
        .then(
          () =>
            (timeout = window.setTimeout(() => {
              navigate(0);
            }, tokenExpirationTime))
        )
        .catch((error) => console.error(error))
        .finally(() => setAppLoading(false));

      return () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
        }
      };
    } else {
      setAppLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      setAppLoading(false);
    }
  }, [authUser]);

  return appLoading ? (
    <LoadingTwitterX />
  ) : (
    <>
      {!authUserId &&
        (openModal === "login" ? (
          <LoginModal />
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
