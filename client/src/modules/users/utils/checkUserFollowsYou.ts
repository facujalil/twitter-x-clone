import { IAuthUser } from "../types/userTypes";

export const checkUserFollowsYou = (
  authUser: IAuthUser,
  followerId: number
) => {
  const userFollowsYou =
    authUser &&
    authUser.followers.find((user) => user.follower_id === followerId);

  return userFollowsYou;
};
