import { Dispatch, SetStateAction } from "react";
import { IPost, IPostComment } from "modules/posts/types/postTypes";
import { Link, useNavigate } from "react-router-dom";
import { formatElapsedTime } from "modules/posts/utils/formatElapsedTime";
import Avatar from "core/components/Avatar";
import CommentButton from "./CommentButton";
import ToggleLikeButton from "./ToggleLikeButton";

interface Props {
  post?: IPost;
  comment?: IPostComment;
  view?: "item" | "detail" | "comment";
  setFocusTextarea?: Dispatch<SetStateAction<boolean>>;
}

function Post({ post, comment, view, setFocusTextarea }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-start p-4 gap-3 transition hover:bg-[#080808] border-b border-b-[#2f3336]
          ${view === "comment" ? "cursor-default" : "cursor-pointer"}`}
      onClick={() => (post ? navigate(`/posts/${post.post_id}`) : null)}
    >
      <Link
        to={`/users/${post ? post.from_user_id : comment?.from_user_id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={post ? post.avatar : comment?.avatar}
          size="medium"
          hover
        />
      </Link>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-[0.4rem]">
          <Link
            to={`/users/${
              post ? post.from_user_id : comment ? comment.from_user_id : ""
            }`}
            className="overflow-hidden font-bold text-nowrap text-ellipsis hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {post ? post.display_name : comment?.display_name}
          </Link>
          <Link
            to={`/users/${
              post ? post.from_user_id : comment ? comment.from_user_id : ""
            }`}
            className="overflow-hidden text-nowrap text-ellipsis text-[#71767b] "
            onClick={(e) => e.stopPropagation()}
          >
            @{post ? post.username : comment?.username}
          </Link>
          <span className="text-[#71767b]">·</span>
          {post && post.post_id ? (
            <Link
              to={`/posts/${post.post_id}`}
              className="text-[#71767b] text-nowrap hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {formatElapsedTime(
                post.post_elapsed_time,
                post.post_creation_date
              )}
            </Link>
          ) : comment ? (
            <p
              className="text-[#71767b] text-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              {formatElapsedTime(
                comment.comment_elapsed_time,
                comment.comment_creation_date
              )}
            </p>
          ) : null}
        </div>
        <p
          className={`break-words mt-[0.35rem] text-[1.05rem] ${
            post ? "mb-[0.7rem]" : ""
          }`}
        >
          {post ? post.post_text : comment?.comment_text}
        </p>
        {post && view !== "comment" ? (
          <div className="flex items-center gap-8">
            <CommentButton post={post} setFocusTextarea={setFocusTextarea} />
            <ToggleLikeButton post={post} view={view} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Post;
