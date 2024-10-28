import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { IPost } from "../types/postTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { Link } from "react-router-dom";
import { useModalContext } from "core/context/ModalContext";
import { createPost, commentPost } from "../api/posts.api";
import { addComment, addPost, incrementComments } from "core/store/postsSlice";
import Avatar from "core/components/Avatar";

interface Props {
  view?: "modal" | "comment" | "post";
  focusTextarea?: boolean;
  setFocusTextarea?: Dispatch<SetStateAction<boolean>>;
  postDetail?: IPost;
  postId?: number;
  postDetailLoading?: boolean;
  autoFocus?: boolean;
}

function PostForm({
  view,
  focusTextarea,
  setFocusTextarea,
  postDetail,
  postId,
  postDetailLoading,
  autoFocus,
}: Props) {
  const dispatch = useDispatch();

  const { authUser, userProfile } = useSelector(
    (state: RootState) => state.users
  );

  const { closeModal } = useModalContext();

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
    if (textarea === "" || !authUser) {
      return;
    }

    if (view === "comment" && postDetail && postId) {
      commentPost(authUser.user_id, postDetail.from_user_id, postId, textarea)
        .then((data) =>
          dispatch(
            addComment({
              comment_id: data.comment_id,
              from_user_id: authUser.user_id,
              avatar: authUser.avatar,
              display_name: authUser.display_name,
              username: authUser.username,
              comment_text: textarea,
              comment_creation_date: new Date().toISOString(),
              comment_elapsed_time: 0,
            })
          )
        )
        .then(() => dispatch(incrementComments()))
        .catch((error) => console.error(error));
    } else {
      createPost(authUser.user_id, textarea)
        .then((data) =>
          dispatch(
            addPost({
              post: {
                post_id: data.post_id,
                from_user_id: authUser.user_id,
                avatar: authUser.avatar,
                display_name: authUser.display_name,
                username: authUser.username,
                post_text: textarea,
                post_creation_date: new Date().toISOString(),
                post_elapsed_time: 0,
                total_likes: 0,
                total_comments: 0,
              },
              userProfileId: userProfile?.user_id,
            })
          )
        )
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
      <div className="flex justify-between items-start w-full">
        {view === "modal" ? (
          <Avatar
            src={authUser?.avatar}
            size="small"
            extraClasses="w-[2.65rem] h-[2.65rem]"
          />
        ) : (
          <Link to={`/users/${authUser?.user_id}`}>
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
