import { IPost } from "modules/posts/types/postTypes";
import { useAppContext } from "core/context/AppContext";
import { likePost, unlikePost } from "modules/posts/api/posts.api";
import { getAuthUser } from "modules/users/api/users.api";
import { authUserId } from "core/utils/localStorage";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
  post: IPost;
}

function ToggleLikeButton({ post }: Props) {
  const { authUser, setAuthUser, setOpenModal } = useAppContext();

  const isLiked = !!authUser?.liked_posts.find(
    (likedPost) => likedPost.liked_post_id === post.post_id
  );

  const toggleLike = (
    isLiked: boolean,
    fromUserId: number,
    toUserId: number,
    postId: number
  ) => {
    if (isLiked) {
      unlikePost(fromUserId, postId)
        .then(() => getAuthUser(fromUserId))
        .then((data) => setAuthUser(data))
        .catch((error) => console.error(error));
    } else {
      likePost(fromUserId, toUserId, postId)
        .then(() => getAuthUser(fromUserId))
        .then((data) => setAuthUser(data))
        .catch((error) => console.error(error));
    }
  };

  return (
    <button
      className={`flex justify-center items-center gap-[0.4rem] text-[0.95rem] font-medium text-[#71767b] bg-transparent transition ${
        !isLiked ? "hover:text-[#ef4444]" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        !authUserId
          ? setOpenModal("login")
          : toggleLike(isLiked, authUserId, post.from_user_id, post.post_id);
      }}
    >
      {!isLiked ? (
        <AiOutlineHeart className="text-base" />
      ) : (
        <AiFillHeart className="text-base text-[#ff0000]" />
      )}{" "}
      <span>{post.total_likes}</span>
    </button>
  );
}

export default ToggleLikeButton;
