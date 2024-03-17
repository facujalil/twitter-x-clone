import React, { useContext } from "react";
import { ILoggedInUser, IRecommendedUser, IUserProfile } from "../types";
import { Context } from "../context/Context";
import { checkYouFollowUser } from "../utils/checkYouFollowUser";
import { followUser, getUserData, unfollowUser } from "../api/users.api";
import { loggedInUserId } from "../utils/localStorage";

interface Props {
  user: IUserProfile | IRecommendedUser;
}

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function HandleFollowButton({ user }: Props) {
  const { loggedInUserData, setLoggedInUserData, setLoginModalOpen } =
    useContext(Context) as IContext;

  return (
    <>
      {checkYouFollowUser(loggedInUserData, user) ? (
        <button
          className="w-32 py-2 text-[0.9rem] text-center text-nowrap text-white bg-transparent border border-white/50 rounded-full hover:text-[#ff0000] hover:bg-[#ff000025] hover:border-[#ff0000] before:content-['Siguiendo'] hover:before:content-['Dejar_de_seguir']"
          onClick={(e) => {
            e.stopPropagation();
            unfollowUser(loggedInUserId, user.user_id)
              .then(() => getUserData(loggedInUserId))
              .then((data) => setLoggedInUserData(data));
          }}
        ></button>
      ) : (
        <button
          className="py-2 px-6 text-[0.9rem] font-medium text-black bg-white rounded-full transition hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            loggedInUserId
              ? followUser(loggedInUserId, user.user_id)
                  .then(() => getUserData(loggedInUserId))
                  .then((data) => setLoggedInUserData(data))
              : setLoginModalOpen(true);
          }}
        >
          Seguir
        </button>
      )}
    </>
  );
}

export default HandleFollowButton;
