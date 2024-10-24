import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { getPostDetail, getPostComments } from "modules/posts/api/posts.api";
import { setPostComments, setPostDetail } from "core/store/postsSlice";
import Header from "core/components/Header";
import LoadingSpinner from "core/components/LoadingSpinner";
import Post from "modules/posts/components/Post/Post";
import PostForm from "modules/posts/components/PostForm";

function PostDetail() {
  const { postId } = useParams();
  const id = Number(postId);

  const dispatch = useDispatch();

  const postDetail = useSelector((state: RootState) => state.posts.postDetail);
  const postComments = useSelector(
    (state: RootState) => state.posts.postComments
  );
  const authUserId = useSelector((state: RootState) => state.users.authUserId);

  const [searchParams] = useSearchParams();
  const autoFocus = authUserId
    ? searchParams.get("autoFocus") === "true"
    : false;

  const [postDetailLoading, setPostDetailLoading] = useState(true);
  const [postCommentsLoading, setPostCommentsLoading] = useState(true);
  const [focusTextarea, setFocusTextarea] = useState(false);

  useEffect(() => {
    getPostDetail(id)
      .then((data) => dispatch(setPostDetail(data)))
      .catch((error) => console.error(error))
      .finally(() => setPostDetailLoading(false))
      .then(() =>
        getPostComments(id)
          .then((data) => dispatch(setPostComments(data)))
          .catch((error) => console.error(error))
          .finally(() => setPostCommentsLoading(false))
      );

    return () => {
      dispatch(setPostDetail(null));
      dispatch(setPostComments([]));
    };
  }, []);

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
