import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { IRecommendedUser } from "modules/users/types/userTypes";
import { getRecommendedUsers } from "modules/users/api/users.api";
import LoadingSpinner from "core/components/LoadingSpinner";
import Avatar from "core/components/Avatar";
import { checkUserFollowsYou } from "modules/users/utils/checkUserFollowsYou";
import FollowsYouTag from "modules/users/components/FollowsYouTag";
import ToggleFollowButton from "modules/users/components/ToggleFollowButton";

function RecommendedUsers() {
  const navigate = useNavigate();

  const authUser = useSelector((state: RootState) => state.users.authUser);

  const [recommendedUsers, setRecommendedUsers] = useState<IRecommendedUser[]>(
    []
  );
  const [recommendedUsersLoading, setRecommendedUsersLoading] = useState(true);

  useEffect(() => {
    if (!recommendedUsersLoading) {
      setRecommendedUsersLoading(true);
    }

    getRecommendedUsers(authUser?.user_id)
      .then((data) => setRecommendedUsers(data))
      .catch((error) => console.error(error))
      .finally(() => setRecommendedUsersLoading(false));
  }, []);

  return recommendedUsersLoading ? (
    <LoadingSpinner extraClasses=" h-[13.5rem]" />
  ) : (
    <>
      {recommendedUsers.length > 0
        ? recommendedUsers.map((user) => (
            <div
              key={user.user_id}
              className="flex justify-between items-center gap-4 p-4 cursor-pointer transition hover:bg-[#1d1f23]"
              onClick={() => navigate(`/users/${user.user_id}`)}
            >
              <div className="flex justify-center items-center gap-3 w-full">
                <Link
                  to={`/users/${user.user_id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar src={user.avatar} size="medium" hover />
                </Link>

                <div className="overflow-hidden flex-1 flex flex-col gap-[0.2rem]">
                  <Link
                    to={`/users/${user.user_id}`}
                    className="overflow-hidden font-bold text-nowrap text-ellipsis hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.display_name}
                  </Link>
                  <div
                    className={
                      authUser && checkUserFollowsYou(authUser, user.user_id)
                        ? "flex gap-2"
                        : ""
                    }
                  >
                    <Link
                      to={`/users/${user.user_id}`}
                      className="block overflow-hidden text-nowrap text-ellipsis text-[#71767b]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @{user.username}
                    </Link>
                    {authUser && checkUserFollowsYou(authUser, user.user_id) ? (
                      <FollowsYouTag />
                    ) : null}
                  </div>
                </div>
                <ToggleFollowButton user={user} />
              </div>
            </div>
          ))
        : null}
    </>
  );
}

export default RecommendedUsers;
