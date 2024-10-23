import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { authUserId } from "core/utils/localStorage";
import { IPost, IPostComment } from "modules/posts/types/postTypes";
import { getPostDetail, getPostComments } from "modules/posts/api/posts.api";
import Header from "core/components/Header";
import LoadingSpinner from "core/components/LoadingSpinner";
import Post from "modules/posts/components/Post/Post";
import PostForm from "modules/posts/components/PostForm";

function PostDetail() {
  const { postId } = useParams();
  const id = Number(postId);

  const [searchParams] = useSearchParams();
  const autoFocus = authUserId
    ? searchParams.get("autoFocus") === "true"
    : false;

  const [postDetail, setPostDetail] = useState<IPost | null>(null);
  const [postComments, setPostComments] = useState<IPostComment[]>([]);
  const [postDetailLoading, setPostDetailLoading] = useState(true);
  const [postCommentsLoading, setPostCommentsLoading] = useState(true);
  const [focusTextarea, setFocusTextarea] = useState(false);

  useEffect(() => {
    getPostDetail(id)
      .then((data) => setPostDetail(data))
      .catch((error) => console.error(error))
      .finally(() => setPostDetailLoading(false));

    return () => {
      setPostDetail(null);
    };
  }, []);

  useEffect(() => {
    if (postDetail) {
      getPostComments(id)
        .then((data) => setPostComments(data))
        .catch((error) => console.error(error))
        .finally(() => setPostCommentsLoading(false));

      return () => {
        setPostComments([]);
      };
    }
  }, [postDetail]);

  useEffect(() => {
    if (postDetail) {
      document.title = `${postDetail.display_name} en Twitter X: "${postDetail.post_text}" / Twitter X`;
    }
  }, [postDetail]);

  return (
    <div className="w-full h-full">
      <Header title="Post" showBackButton />
      {postDetailLoading ? (
        <LoadingSpinner extraClasses="p-8" />
      ) : postDetail ? (
        <Post
          post={postDetail}
          view="detail"
          setFocusTextarea={setFocusTextarea}
        />
      ) : (
        <p className="pt-4 text-center">Este post no existe</p>
      )}
      {authUserId && postDetail ? (
        <>
          <PostForm
            view="comment"
            postId={id}
            postDetail={postDetail}
            setPostDetail={setPostDetail}
            postDetailLoading={postDetailLoading}
            autoFocus={autoFocus}
            focusTextarea={focusTextarea}
            setFocusTextarea={setFocusTextarea}
          />
          {postCommentsLoading ? (
            <LoadingSpinner extraClasses="p-8" />
          ) : postComments.length > 0 ? (
            postComments.map((comment) => (
              <Post key={comment.comment_id} comment={comment} view="comment" />
            ))
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default PostDetail;
