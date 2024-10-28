import { Dispatch, SetStateAction } from "react";
import { IPost } from "modules/posts/types/postTypes";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";
import { AiOutlineMessage } from "react-icons/ai";

interface Props {
  post: IPost;
  setFocusTextarea?: Dispatch<SetStateAction<boolean>>;
}

function CommentButton({ post, setFocusTextarea }: Props) {
  const navigate = useNavigate();

  const authUser = useSelector((state: RootState) => state.users.authUser);

  const { setOpenModal } = useModalContext();

  return (
    <button
      className="flex justify-center items-center gap-[0.4rem] text-[0.95rem] font-medium text-[#71767b] transition hover:text-[#0ea5e9]"
      onClick={(e) => {
        e.stopPropagation();
        if (authUser) {
          navigate(`/posts/${post.post_id}?autoFocus=true`);
          if (setFocusTextarea) {
            setFocusTextarea(true);
          }
        } else {
          setOpenModal("login");
        }
      }}
    >
      <AiOutlineMessage className="text-base hover:text-[#0ea5e9]" />{" "}
      <span>{post.total_comments}</span>
    </button>
  );
}

export default CommentButton;
