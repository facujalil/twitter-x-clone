import React from "react";
import { IPost } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import Post from "./Post";

interface Props {
  postsLoading: boolean;
  posts: IPost[];
}

function Posts({ postsLoading, posts }: Props) {
  return (
    <div>
      {postsLoading ? (
        <LoadingSpinner style={{ paddingTop: "2rem" }} />
      ) : (
        posts.length > 0 &&
        posts.map((post) => (
          <React.Fragment key={post.post_id}>
            <Post post={post} />
          </React.Fragment>
        ))
      )}
    </div>
  );
}

export default Posts;
