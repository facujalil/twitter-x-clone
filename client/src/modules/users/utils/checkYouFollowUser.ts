import { IAuthUser } from "../types/userTypes";

export const checkYouFollowUser = (
  authUser: IAuthUser,
  followingId: number
) => {
  const youFollowUser =
    authUser &&
    authUser.following.find((user) => user.following_id === followingId);

  return youFollowUser;
};
