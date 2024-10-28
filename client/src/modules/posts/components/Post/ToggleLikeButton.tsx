import { useState } from "react";
import { IPost } from "modules/posts/types/postTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";
import { likePost, unlikePost } from "modules/posts/api/posts.api";
import { decreaseLikes, incrementLikes } from "core/store/postsSlice";
import { addLikedPost, removeLikedPost } from "core/store/usersSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
  post: IPost;
  view?: "item" | "detail";
}

function ToggleLikeButton({ post, view }: Props) {
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.users.authUser);

  const { setOpenModal } = useModalContext();

  const [disabled, setDisabled] = useState(false);

  const isLiked = !!authUser?.liked_posts.find(
    (likedPost) => likedPost.liked_post_id === post.post_id
  );

  const toggleLike = (
    isLiked: boolean,
    fromUserId: number,
    toUserId: number,
    postId: number
  ) => {
    setDisabled(true);
    if (isLiked) {
      unlikePost(fromUserId, postId)
        .then(() => {
          dispatch(decreaseLikes({ post_id: postId, view: view }));
          dispatch(removeLikedPost(postId));
        })
        .catch((error) => console.error(error))
        .finally(() => setDisabled(false));
    } else {
      likePost(fromUserId, toUserId, postId)
        .then(() => {
          dispatch(
            incrementLikes({
              post_id: postId,
              view: view,
            })
          );
          dispatch(addLikedPost(post.post_id));
        })
        .catch((error) => console.error(error))
        .finally(() => setDisabled(false));
    }
  };

  return (
    <button
      disabled={disabled}
      className={`flex justify-center items-center gap-[0.4rem] text-[0.95rem] font-medium text-[#71767b] transition cursor-pointer ${
        !isLiked ? "hover:text-[#ef4444]" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        !authUser
          ? setOpenModal("login")
          : toggleLike(
              isLiked,
              authUser.user_id,
              post.from_user_id,
              post.post_id
            );
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
