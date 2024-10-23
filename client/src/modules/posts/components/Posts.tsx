import { IPost } from "../types/postTypes";
import LoadingSpinner from "core/components/LoadingSpinner";
import Post from "./Post/Post";

interface Props {
  postsLoading: boolean;
  posts: IPost[];
}

function Posts({ postsLoading, posts }: Props) {
  return (
    <div>
      {postsLoading ? (
        <LoadingSpinner extraClasses="pt-8" />
      ) : posts.length > 0 ? (
        posts.map((post) => <Post key={post.post_id} post={post} view="item" />)
      ) : null}
    </div>
  );
}

export default Posts;
