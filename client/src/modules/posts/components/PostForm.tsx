import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { IPost } from "../types/postTypes";
import { Link } from "react-router-dom";
import { useAppContext } from "core/context/AppContext";
import { authUserId } from "core/utils/localStorage";
import { createPost, commentPost, getPostDetail } from "../api/posts.api";
import { getAuthUser } from "modules/users/api/users.api";
import Avatar from "core/components/Avatar";

interface Props {
  view?: "modal" | "comment" | "post";
  focusTextarea?: boolean;
  setFocusTextarea?: Dispatch<SetStateAction<boolean>>;
  postDetail?: IPost | null;
  setPostDetail?: Dispatch<SetStateAction<IPost | null>>;
  postId?: number;
  postDetailLoading?: boolean;
  autoFocus?: boolean;
}

function PostForm({
  view,
  focusTextarea,
  setFocusTextarea,
  postDetail,
  setPostDetail,
  postId,
  postDetailLoading,
  autoFocus,
}: Props) {
  const { authUser, setAuthUser, closeModal } = useAppContext();

  const [textarea, setTextarea] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (
      view === "comment" &&
      textareaRef.current &&
      focusTextarea &&
      setFocusTextarea
    ) {
      textareaRef.current.focus();
      setFocusTextarea(false);
    }
  }, [focusTextarea]);

  const handlePost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textarea === "" || !authUserId) {
      return;
    }

    if (view === "comment" && postDetail && postId) {
      commentPost(authUserId, postDetail.from_user_id, postId, textarea)
        .then(() => getPostDetail(postId))
        .then((data) => setPostDetail && setPostDetail(data))
        .catch((error) => console.error(error));
    } else {
      createPost(authUserId, textarea)
        .then(() => getAuthUser(authUserId!))
        .then((data) => setAuthUser(data))
        .catch((error) => console.error(error))
        .finally(() => (view === "modal" ? closeModal() : null));
    }
    setTextarea("");
  };

  return (
    <form
      className={`flex flex-col items-end w-full p-4 ${
        view === "post" || postDetailLoading
          ? "border-y border-y-[#2f3336]"
          : ""
      }
           ${
             view === "comment" && !postDetailLoading
               ? "border-b border-b-[#2f3336]"
               : ""
           }
      }`}
      onSubmit={handlePost}
    >
      <div className="flex justify-between w-full">
        {view === "modal" ? (
          <Avatar
            src={authUser?.avatar}
            size="small"
            extraClasses="w-[2.65rem] h-[2.65rem]"
          />
        ) : (
          <Link to={`/users/${authUserId}`}>
            <Avatar
              src={authUser?.avatar}
              size="small"
              extraClasses="w-[2.65rem] h-[2.65rem]"
              hover
            />
          </Link>
        )}
        <textarea
          ref={textareaRef}
          className="w-[calc(100%-3.5rem)] py-2 outline-none text-xl bg-transparent resize-none focus:border-b focus:border-b-[#2f3336] focus:mb-[-1px]"
          name="textarea"
          maxLength={280}
          value={textarea}
          autoFocus={autoFocus}
          placeholder={
            view !== "comment" ? "¿Qué está pasando?" : "Postea tu respuesta"
          }
          onChange={(e) => setTextarea(e.target.value)}
        />
      </div>
      <button
        disabled={!textarea.trim()}
        className="mt-4 p-3 text-[0.9rem] font-medium bg-[#1d9bf0] rounded-full transition hover:opacity-90 disabled:opacity-50"
      >
        {view !== "comment" ? "Postear" : "Responder"}
      </button>
    </form>
  );
}

export default PostForm;
