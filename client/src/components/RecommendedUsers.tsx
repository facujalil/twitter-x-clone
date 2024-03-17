import { useContext, useEffect, useState } from "react";
import { IRecommendedUser, ILoggedInUser } from "../types";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { checkUserFollowsYou } from "../utils/checkUserFollowsYou";
import { getRecommendedUsers } from "../api/users.api";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";
import FollowsYouTag from "./FollowsYouTag";
import HandleFollowButton from "./HandleFollowButton";

interface IContext {
  loggedInUserData: ILoggedInUser;
}

function RecommendedUsers() {
  const navigate = useNavigate();

  const { loggedInUserData } = useContext(Context) as IContext;

  useEffect(() => {
    getRecommendedUsers(loggedInUserId ? loggedInUserId : 0)
      .then((data) => setRecommendedUsers(data))
      .then(() => setLoadingRecommendedUsers(false));
  }, [loggedInUserId]);

  const [recommendedUsers, setRecommendedUsers] = useState<IRecommendedUser[]>(
    []
  );
  const [loadingRecommendedUsers, setLoadingRecommendedUsers] = useState(true);

  return loadingRecommendedUsers ? (
    <LoadingSpinner style={{ height: "13.5rem" }} />
  ) : (
    <>
      {recommendedUsers.length > 0 &&
        recommendedUsers.map((user) => (
          <div
            key={user.user_id}
            className="flex justify-between items-center gap-4 p-4 cursor-pointer transition hover:bg-[#1d1f23]"
            onClick={() => navigate(`/users/${user.user_id}`)}
          >
            <div className="flex justify-center items-center gap-3 w-full">
              <NavLink
                to={`/users/${user.user_id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar
                  src={user.profile_picture}
                  size="w-10 h-10"
                  hover={true}
                />
              </NavLink>

              <div className="flex-1 flex flex-col gap-[0.2rem] overflow-hidden">
                <NavLink
                  to={`/users/${user.user_id}`}
                  className="whitespace-nowrap font-bold overflow-hidden text-ellipsis hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.display_name}
                </NavLink>
                <div
                  className={
                    checkUserFollowsYou(loggedInUserData, user)
                      ? "flex gap-2"
                      : ""
                  }
                >
                  <NavLink
                    to={`/users/${user.user_id}`}
                    className="text-nowrap text-[#71767b] overflow-hidden text-ellipsis"
                    onClick={(e) => e.stopPropagation()}
                  >
                    @{user.username}
                  </NavLink>
                  {checkUserFollowsYou(loggedInUserData, user) && (
                    <FollowsYouTag />
                  )}
                </div>
              </div>
              <HandleFollowButton user={user} />
            </div>
          </div>
        ))}
    </>
  );
}

export default RecommendedUsers;
