import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "core/context/AppContext";
import { IUserProfile } from "modules/users/types/userTypes";
import { IPost } from "modules/posts/types/postTypes";
import { getUserProfile } from "modules/users/api/users.api";
import { getProfilePosts } from "modules/posts/api/posts.api";
import { authUserId } from "core/utils/localStorage";
import { checkUserFollowsYou } from "modules/users/utils/checkUserFollowsYou";
import LoadingSpinner from "core/components/LoadingSpinner";
import EditProfileModal from "./EditProfileModal/EditProfileModal";
import Header from "core/components/Header";
import Avatar from "core/components/Avatar";
import HandleFollowButton from "modules/users/components/ToggleFollowButton";
import FollowsYouTag from "modules/users/components/FollowsYouTag";
import { FaCalendarAlt } from "react-icons/fa";
import Posts from "modules/posts/components/Posts";

function Profile() {
  const { userId } = useParams();
  const id = Number(userId);

  const { authUser, openModal, setOpenModal } = useAppContext();

  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [profilePosts, setProfilePosts] = useState<IPost[]>([]);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [profilePostsLoading, setProfilePostsLoading] = useState(true);

  useEffect(() => {
    return () => {
      setUserProfile(null);
    };
  }, []);

  useEffect(() => {
    if (!userProfileLoading) {
      setUserProfileLoading(true);
    }
    if (!profilePostsLoading) {
      setProfilePostsLoading(true);
    }
  }, [id]);

  useEffect(() => {
    getUserProfile(id)
      .then((data) => setUserProfile(data))
      .catch((error) => console.error(error))
      .finally(() => setUserProfileLoading(false));

    getProfilePosts(id)
      .then((data) => setProfilePosts(data))
      .catch((error) => console.error(error))
      .finally(() => setProfilePostsLoading(false));
  }, [id, authUser]);

  useEffect(() => {
    if (userProfile) {
      document.title = `${userProfile.display_name} (@${userProfile.username}) / Twitter X`;
    } else {
      document.title = "Perfil / Twitter X";
    }
  }, [userProfile]);

  return (
    <div className="w-full h-full">
      {userProfileLoading ? (
        <LoadingSpinner extraClasses="min-h-screen" />
      ) : (
        <>
          {userProfile && openModal === "edit profile" ? (
            <EditProfileModal userProfile={userProfile} />
          ) : null}
          <Header
            title={userProfile?.display_name || "Perfil"}
            showBackButton
          />
          {userProfile ? (
            <>
              <div className="flex flex-col w-full">
                <div
                  style={
                    userProfile.cover
                      ? {
                          backgroundImage: `url(${userProfile.cover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                          backgroundRepeat: "no-repeat",
                        }
                      : undefined
                  }
                  className="md:h-[10.5rem] relative w-full h-48 bg-[#3e4144]"
                ></div>

                <div className="z-20 flex justify-between items-center w-full px-4">
                  <Avatar
                    src={userProfile.avatar}
                    size="large"
                    extraClasses="md:mt-[-3.25rem] mt-[-4rem] border-4 border-black"
                  />
                  {authUserId === userProfile.user_id ? (
                    <button
                      className="py-2 px-6 text-[0.9rem] font-medium bg-transparent border border-[#ffffff50] rounded-full transition hover:bg-[#181919]"
                      onClick={() => setOpenModal("edit profile")}
                    >
                      Editar perfil
                    </button>
                  ) : (
                    <HandleFollowButton user={userProfile} />
                  )}
                </div>
                <div className="flex flex-col gap-[1.15rem] w-full p-4 border-b border-b-[#2f3336]">
                  <div className="flex-1 flex flex-col gap-[0.2rem]">
                    <p className="break-words text-[1.35em] font-bold">
                      {userProfile.display_name}
                    </p>
                    <div
                      className={
                        authUser &&
                        checkUserFollowsYou(authUser, userProfile.user_id)
                          ? "flex gap-2"
                          : undefined
                      }
                    >
                      <p className="overflow-hidden text-nowrap text-ellipsis text-[#71767b]">
                        @{userProfile.username}
                      </p>
                      {authUser &&
                      checkUserFollowsYou(authUser, userProfile.user_id) ? (
                        <FollowsYouTag />
                      ) : null}
                    </div>
                  </div>
                  {userProfile.biography ? (
                    <p>{userProfile.biography}</p>
                  ) : null}
                  <p className="flex items-center gap-[0.2rem] text-[#71767b]">
                    <FaCalendarAlt /> Se unió en{" "}
                    {`${Intl.DateTimeFormat("es-AR", { month: "long" }).format(
                      new Date(userProfile.user_creation_date.slice(5, 7))
                    )} de ${userProfile.user_creation_date.slice(0, 4)}`}
                  </p>
                  <div className="flex gap-6">
                    <div className="text-[#71767b]">
                      <p>
                        <span className="text-white">
                          {userProfile.following.length}
                        </span>{" "}
                        siguiendo
                      </p>
                    </div>
                    <div className="text-[#71767b]">
                      <p>
                        <span className="text-white">
                          {userProfile.followers.length}
                        </span>{" "}
                        seguidores
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Posts postsLoading={profilePostsLoading} posts={profilePosts} />
            </>
          ) : (
            <p className="pt-4 text-center">Esta cuenta no existe</p>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
