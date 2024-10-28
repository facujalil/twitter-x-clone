import { IRecommendedUser, IUserProfile } from "../types/userTypes";
import { useModalContext } from "core/context/ModalContext";
import { checkYouFollowUser } from "../utils/checkYouFollowUser";
import { followUser, unfollowUser } from "../api/users.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { addFollow, removeFollow } from "core/store/usersSlice";
import { useState } from "react";

interface Props {
  user: IUserProfile | IRecommendedUser;
}

function ToggleFollowButton({ user }: Props) {
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.users.authUser);

  const { setOpenModal } = useModalContext();

  const [disabled, setDisabled] = useState(false);

  const isFollowing = !!(
    authUser && checkYouFollowUser(authUser, user.user_id)
  );

  const toggleFollow = (
    isFollowing: boolean,
    authUserId: number,
    followingId: number
  ) => {
    setDisabled(true);
    if (isFollowing) {
      unfollowUser(authUserId, followingId)
        .then(() =>
          dispatch(
            removeFollow({
              following_id: followingId,
              follower_id: authUserId,
            })
          )
        )
        .catch((error) => console.error(error))
        .finally(() => setDisabled(false));
    } else {
      followUser(authUserId, followingId)
        .then(() =>
          dispatch(
            addFollow({
              following_id: followingId,
              follower_id: authUserId,
            })
          )
        )
        .catch((error) => console.error(error))
        .finally(() => setDisabled(false));
    }
  };

  return (
    <button
      disabled={disabled}
      className={`py-2 text-[0.9rem] font-medium rounded-full cursor-pointer ${
        isFollowing
          ? "overflow-hidden w-32 px-2 text-center text-nowrap text-ellipsis border border-white/50 hover:text-[#ff0000] hover:bg-[#ff000025] hover:border-[#ff0000] before:content-['Siguiendo'] hover:before:content-['Dejar_de_seguir']"
          : "px-6 text-black bg-white transition hover:opacity-90"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        !authUser
          ? setOpenModal("login")
          : toggleFollow(isFollowing, authUser.user_id, user.user_id);
      }}
    >
      {!isFollowing ? "Seguir" : null}
    </button>
  );
}

export default ToggleFollowButton;
