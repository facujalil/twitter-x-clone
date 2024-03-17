import React, { useContext, useEffect, useState } from "react";
import { IPost, ILoggedInUser, IUserProfile } from "../types";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { checkUserFollowsYou } from "../utils/checkUserFollowsYou";
import { getUserProfileData } from "../api/users.api";
import { getPostsFromProfile } from "../api/posts.api";
import { FaCalendarAlt } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal";
import Header from "../components/Header";
import Posts from "../components/Posts";
import LoadingSpinner from "../components/LoadingSpinner";
import Avatar from "../components/Avatar";
import HandleFollowButton from "../components/HandleFollowButton";
import FollowsYouTag from "../components/FollowsYouTag";

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Profile() {
  const { userId } = useParams();

  const id = Number(userId);

  const { loggedInUserData } = useContext(Context) as IContext;

  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState<IUserProfile>();
  const [postsFromProfileLoading, setPostsFromProfileLoading] = useState(true);
  const [postsFromProfile, setPostsFromProfile] = useState<IPost[]>([]);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  useEffect(() => {
    getUserProfileData(id)
      .then((data) => setUserProfileData(data))
      .then(() => setProfileLoading(false));
  }, [userId, loggedInUserData]);

  useEffect(() => {
    if (userProfileData) {
      document.title = `${userProfileData.display_name} (@${userProfileData.username}) / Twitter X`;
      getPostsFromProfile(id)
        .then((data) => setPostsFromProfile(data))
        .then(() => setPostsFromProfileLoading(false));
    } else {
      document.title = "Perfil / Twitter X";
    }
  }, [userProfileData]);

  return (
    <div className="w-full h-full">
      {profileLoading ? (
        <LoadingSpinner style={{ minHeight: "100vh" }} />
      ) : (
        <>
          {userProfileData && modalEditOpen && (
            <EditProfileModal
              userProfileData={userProfileData}
              setModalEditOpen={setModalEditOpen}
            />
          )}
          <Header
            title={userProfileData ? userProfileData.display_name : "Perfil"}
          />
          {userProfileData ? (
            <>
              <div className="flex flex-col w-full">
                <div
                  style={
                    userProfileData.cover_picture
                      ? {
                          backgroundImage: `url(${userProfileData.cover_picture})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                  className="md:h-[10.5rem] relative w-full h-48 bg-[#3e4144]"
                ></div>

                <div className="z-20 flex justify-between items-center w-full px-4">
                  <Avatar
                    src={userProfileData.profile_picture}
                    size="md:h-[6.5rem] md:w-[6.5rem] h-32 w-32"
                    isLargue={true}
                  />
                  {id === loggedInUserId ? (
                    <button
                      className="py-2 px-6 text-[0.9rem] font-medium bg-transparent border border-[#ffffff50] rounded-full transition hover:bg-[#181919]"
                      onClick={() => setModalEditOpen(true)}
                    >
                      Editar perfil
                    </button>
                  ) : (
                    <HandleFollowButton user={userProfileData} />
                  )}
                </div>

                <div className="flex flex-col gap-[1.15rem] w-full p-4 border-b border-b-[#2f3336]">
                  <div className="flex-1 flex flex-col gap-[0.2rem]">
                    <p className="text-[1.35em] whitespace-nowrap font-bold overflow-hidden text-ellipsis">
                      {userProfileData.display_name}
                    </p>
                    <div
                      className={
                        checkUserFollowsYou(loggedInUserData, userProfileData)
                          ? "flex gap-2"
                          : ""
                      }
                    >
                      <p className="text-nowrap text-[#71767b] overflow-hidden text-ellipsis">
                        @{userProfileData.username}
                      </p>
                      {checkUserFollowsYou(
                        loggedInUserData,
                        userProfileData
                      ) && <FollowsYouTag />}
                    </div>
                  </div>
                  {userProfileData.biography && (
                    <p>{userProfileData.biography}</p>
                  )}
                  <p className="flex items-center gap-[0.2rem] text-[#71767b]">
                    <FaCalendarAlt /> Se unió en{" "}
                    {`${Intl.DateTimeFormat("es-AR", { month: "long" }).format(
                      new Date(userProfileData.user_creation_date.slice(5, 7))
                    )} de ${userProfileData.user_creation_date.slice(0, 4)}`}
                  </p>

                  <div className="flex gap-6">
                    <div className="text-[#71767b]">
                      <p>
                        <span className="text-white">
                          {userProfileData.following_list.length}
                        </span>{" "}
                        siguiendo
                      </p>
                    </div>
                    <div className="text-[#71767b]">
                      <p>
                        <span className="text-white">
                          {userProfileData.followers_list.length}
                        </span>{" "}
                        seguidores
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Posts
                postsLoading={postsFromProfileLoading}
                posts={postsFromProfile}
              />
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
