import { ILoggedInUser, IRecommendedUser, IUserProfile } from "../types";

export const checkUserFollowsYou = (
  loggedInUserData: ILoggedInUser,
  user: IUserProfile | IRecommendedUser
) => {
  const userFollowsYou =
    loggedInUserData &&
    loggedInUserData.followers_list
      .map((user) => user.follower_id)
      .includes(user.user_id);

  return userFollowsYou;
};
