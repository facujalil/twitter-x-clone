import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ILoggedInUser } from "../types";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId, tokenExpirationTime } from "../utils/localStorage";
import { getUserData } from "../api/users.api";
import LoadingTwitterX from "./LoadingTwitterX";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import PostModal from "./PostModal";
import Sidebar from "./Sidebar";
import RecommendedUsers from "./RecommendedUsers";

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
  loginModalOpen: boolean;
  registerModalOpen: boolean;
}

function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  const {
    loggedInUserData,
    setLoggedInUserData,
    loginModalOpen,
    registerModalOpen,
  } = useContext(Context) as IContext;

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (loggedInUserId && tokenExpirationTime) {
      getUserData(loggedInUserId)
        .then((data) => setLoggedInUserData(data))
        .then(() => setAppLoading(false));
      setTimeout(() => {
        navigate(0);
      }, tokenExpirationTime);
    } else {
      setAppLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserData) {
      setAppLoading(false);
    }
  }, [loggedInUserData]);

  return (
    <>
      {appLoading ? (
        <LoadingTwitterX />
      ) : (
        <>
          {!loggedInUserId &&
            (loginModalOpen ? (
              <LoginModal />
            ) : (
              registerModalOpen && <RegisterModal />
            ))}

          {postModalOpen && (
            <PostModal
              postModalOpen={postModalOpen}
              setPostModalOpen={setPostModalOpen}
            />
          )}

          <Sidebar setPostModalOpen={setPostModalOpen} />

          <main className="flex-1 flex flex-col overflow-hidden max-w-[590px] min-h-screen border-x border-[#2f3336]">
            {children}
          </main>

          <div className="lg:hidden flex flex-col overflow-hidden w-[21.5rem] mt-4 bg-[#16181c] rounded-3xl">
            <h4 className="overflow-hidden p-4 text-[1.3rem] font-bold text-ellipsis whitespace-nowrap">
              A quién seguir
            </h4>
            <RecommendedUsers />
          </div>
        </>
      )}
    </>
  );
}

export default AppLayout;
