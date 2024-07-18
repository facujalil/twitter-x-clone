import React, { useContext, useState } from "react";
import { IPost, ILoggedInUser } from "../types";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { uploadPost, commentPost, getPostDetail } from "../api/posts.api";
import { getUserData } from "../api/users.api";
import Avatar from "./Avatar";

interface Props {
  postModalOpen?: boolean;
  setPostModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isComment?: boolean;
  postId?: number;
  postDetail?: IPost;
  setPostDetail?: React.Dispatch<React.SetStateAction<IPost | undefined>>;
}

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
}

function PostForm({
  postModalOpen,
  setPostModalOpen,
  isComment,
  postId,
  postDetail,
  setPostDetail,
}: Props) {
  const { loggedInUserData, setLoggedInUserData } = useContext(
    Context
  ) as IContext;

  const [textarea, setTextarea] = useState("");

  const closeModalPost = () => {
    setPostModalOpen && setPostModalOpen(false);
    document.body.style.overflowY = "visible";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textarea !== "") {
      if (isComment && postDetail && postId) {
        commentPost(loggedInUserId, postDetail.from_user_id, postId, textarea)
          .then(() => getPostDetail(postId))
          .then((data) => setPostDetail && setPostDetail(data));
      } else {
        uploadPost(loggedInUserId, textarea)
          .then(() => postModalOpen && closeModalPost())
          .then(() => getUserData(loggedInUserId))
          .then((data) => setLoggedInUserData(data));
      }
      setTextarea("");
    }
  };

  return (
    <form
      className={`flex flex-col items-end w-full p-4 ${
        !postModalOpen && !isComment
          ? "border-y border-y-[#2f3336]"
          : isComment && "border-b border-b-[#2f3336]"
      }`}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="flex justify-between w-full">
        {postModalOpen ? (
          <Avatar
            src={loggedInUserData.profile_picture}
            size="w-[2.65rem] h-[2.65rem]"
          />
        ) : (
          <NavLink to={`/users/${loggedInUserId}`}>
            <Avatar
              src={loggedInUserData.profile_picture}
              size="w-[2.65rem] h-[2.65rem]"
              hover={true}
            />
          </NavLink>
        )}
        <textarea
          className="w-[calc(100%-3.5rem)] py-2 outline-none text-xl bg-transparent resize-none focus:border-b focus:border-b-[#2f3336] focus:mb-[-1px]"
          name="textarea"
          maxLength={280}
          value={textarea}
          placeholder={
            !isComment ? "¿Qué está pasando?" : "Postea tu respuesta"
          }
          onChange={(e) => setTextarea(e.target.value)}
        />
      </div>
      <button
        disabled={!textarea.trim()}
        className="mt-4 p-3 text-[0.9rem] font-medium bg-[#1d9bf0] rounded-full transition hover:opacity-90 disabled:opacity-50"
      >
        {!isComment ? "Postear" : "Responder"}
      </button>
    </form>
  );
}

export default PostForm;
