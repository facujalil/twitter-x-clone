import React, { useContext, useEffect, useState } from "react";
import { IPostComment, IPost, ILoggedInUser } from "../types";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { getPostDetail, getPostComments } from "../api/posts.api";
import Header from "../components/Header";
import Post from "../components/Post";
import PostForm from "../components/PostForm";
import LoadingSpinner from "../components/LoadingSpinner";

interface IContext {
  loggedInUserData: ILoggedInUser;
}

function PostDetail() {
  const { postId } = useParams();

  const id = Number(postId);

  const { loggedInUserData } = useContext(Context) as IContext;

  const [postDetail, setPostDetail] = useState<IPost>();
  const [postComments, setPostComments] = useState<IPostComment[]>([]);
  const [postDetailLoading, setPostDetailLoading] = useState(true);
  const [postCommentsLoading, setPostCommentsLoading] = useState(true);

  useEffect(() => {
    getPostDetail(id)
      .then((data) => setPostDetail(data))
      .then(() => setPostDetailLoading(false));
  }, [loggedInUserData]);

  useEffect(() => {
    if (postDetail) {
      document.title = `${postDetail.display_name} en Twitter X: "${postDetail.post_text}" / Twitter X`;
      getPostComments(id)
        .then((data) => setPostComments(data))
        .then(() => setPostCommentsLoading(false));
    }
  }, [postDetail]);

  return (
    <div className="w-full h-full">
      <Header title="Post" />

      {postDetailLoading ? (
        <LoadingSpinner style={{ paddingTop: "2rem" }} />
      ) : postDetail ? (
        <Post post={postDetail} />
      ) : (
        <p className="pt-4 text-center">Este post no existe</p>
      )}

      {postDetail && postDetail.post_id && loggedInUserId && (
        <>
          <PostForm
            isComment={true}
            postId={id}
            postDetail={postDetail}
            setPostDetail={setPostDetail}
          />

          {postCommentsLoading ? (
            <LoadingSpinner style={{ paddingTop: "2rem" }} />
          ) : (
            postComments.length > 0 &&
            postComments.map((comment) => (
              <React.Fragment key={comment.comment_id}>
                <Post comment={comment} />
              </React.Fragment>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default PostDetail;
