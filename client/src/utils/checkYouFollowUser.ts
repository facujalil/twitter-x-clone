import { ILoggedInUser, IRecommendedUser, IUserProfile } from "../types";

export const checkYouFollowUser = (
  loggedInUserData: ILoggedInUser,
  user: IUserProfile | IRecommendedUser
) => {
  const userFollowsYou =
    loggedInUserData &&
    loggedInUserData.following_list
      .map((user) => user.following_id)
      .includes(user.user_id);

  return userFollowsYou;
};
