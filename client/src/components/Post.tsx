import React, { useContext } from "react";
import { IPost, IPostComment, ILoggedInUser } from "../types";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { getUserData } from "../api/users.api";
import { likePost, removeLikeFromPost } from "../api/posts.api";
import { convertDate } from "../utils/convertDate";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "./Avatar";

interface Props {
  post?: IPost;
  comment?: IPostComment;
}

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Post({ post, comment }: Props) {
  const navigate = useNavigate();

  const { loggedInUserData, setLoggedInUserData, setLoginModalOpen } =
    useContext(Context) as IContext;

  const likedPost =
    loggedInUserData &&
    post &&
    post.post_id &&
    loggedInUserData.liked_posts_list
      .map((likedPost) => likedPost.liked_post_id)
      .includes(post.post_id);

  return (
    <div
      className={`flex items-start p-4 gap-3 border-b border-b-[#2f3336] transition hover:bg-[#080808] ${
        comment ? "cursor-default" : "cursor-pointer"
      }`}
      onClick={() => post && navigate(`/posts/${post.post_id}`)}
    >
      <NavLink
        to={`/users/${
          post ? post.from_user_id : comment && comment.from_user_id
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={post ? post.profile_picture : comment && comment.profile_picture}
          size="w-10 h-10"
          hover={true}
        />
      </NavLink>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-[0.4rem]">
          <NavLink
            to={`/users/${
              post ? post.from_user_id : comment && comment.from_user_id
            }`}
            className="whitespace-nowrap font-bold overflow-hidden text-ellipsis hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {post ? post.display_name : comment && comment.display_name}
          </NavLink>
          <NavLink
            to={`/users/${
              post ? post.from_user_id : comment && comment.from_user_id
            }`}
            className="min-w-[8ch] text-nowrap text-[#71767b] overflow-hidden text-ellipsis"
            onClick={(e) => e.stopPropagation()}
          >
            @{post ? post.username : comment && comment.username}
          </NavLink>
          <span className="text-[#71767b]">·</span>
          {post && post.post_id ? (
            <NavLink
              to={`/posts/${post.post_id}`}
              className="text-[#71767b] text-nowrap hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {convertDate(post.post_elapsed_time, post.post_creation_date)}
            </NavLink>
          ) : (
            comment && (
              <p
                className="text-[#71767b] text-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                {convertDate(
                  comment.comment_elapsed_time,
                  comment.comment_creation_date
                )}
              </p>
            )
          )}
        </div>
        <p className={`mt-[0.35rem] text-[1.05rem] ${post && "mb-[0.7rem]"}`}>
          {post ? post.post_text : comment && comment.comment_text}
        </p>
        {post && (
          <div className="flex items-center gap-8">
            <button className="flex justify-center items-center gap-[0.4rem] text-[0.95rem] font-medium text-[#71767b] bg-transparent transition hover:text-[#0ea5e9]">
              <AiOutlineMessage className="text-base hover:text-[#0ea5e9]" />{" "}
              <span>{post && post.total_comments}</span>
            </button>
            <button
              className={`flex justify-center items-center gap-[0.4rem] text-[0.95rem] font-medium text-[#71767b] bg-transparent transition ${
                !likedPost && "hover:text-[#ef4444]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                loggedInUserId && post && post.post_id
                  ? likedPost
                    ? removeLikeFromPost(
                        loggedInUserId,
                        post.from_user_id,
                        post.post_id
                      )
                        .then(() => getUserData(loggedInUserId))
                        .then((data) => setLoggedInUserData(data))
                    : likePost(loggedInUserId, post.from_user_id, post.post_id)
                        .then(() => getUserData(loggedInUserId))
                        .then((data) => setLoggedInUserData(data))
                  : setLoginModalOpen(true);
              }}
            >
              {likedPost ? (
                <AiFillHeart className="text-base text-[#ff0000]" />
              ) : (
                <AiOutlineHeart className="text-base" />
              )}{" "}
              <span>{post && post.total_likes}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
