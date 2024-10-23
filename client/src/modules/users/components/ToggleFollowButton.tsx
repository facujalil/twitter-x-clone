import { IRecommendedUser, IUserProfile } from "../types/userTypes";
import { useAppContext } from "core/context/AppContext";
import { checkYouFollowUser } from "../utils/checkYouFollowUser";
import { followUser, getAuthUser, unfollowUser } from "../api/users.api";
import { authUserId } from "core/utils/localStorage";

interface Props {
  user: IUserProfile | IRecommendedUser;
}

function ToggleFollowButton({ user }: Props) {
  const { authUser, setAuthUser, setOpenModal } = useAppContext();

  const isFollowing = !!(
    authUser && checkYouFollowUser(authUser, user.user_id)
  );

  const toggleFollow = (
    isFollowing: boolean,
    authUserId: number,
    followingId: number
  ) => {
    if (isFollowing) {
      unfollowUser(authUserId, followingId)
        .then(() => getAuthUser(authUserId))
        .then((data) => setAuthUser(data))
        .catch((error) => console.error(error));
    } else {
      followUser(authUserId, followingId)
        .then(() => getAuthUser(authUserId))
        .then((data) => setAuthUser(data))
        .catch((error) => console.error(error));
    }
  };

  return (
    <button
      className={`py-2 text-[0.9rem] font-medium rounded-full ${
        isFollowing
          ? "overflow-hidden w-32 px-2 text-center text-nowrap text-ellipsis text-white bg-transparent border border-white/50 hover:text-[#ff0000] hover:bg-[#ff000025] hover:border-[#ff0000] before:content-['Siguiendo'] hover:before:content-['Dejar_de_seguir']"
          : "px-6 text-black bg-white transition hover:opacity-90"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        !authUserId
          ? setOpenModal("login")
          : toggleFollow(isFollowing, authUserId, user.user_id);
      }}
    >
      {!isFollowing ? "Seguir" : null}
    </button>
  );
}

export default ToggleFollowButton;
