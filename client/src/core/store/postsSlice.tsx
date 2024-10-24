import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPost, IPostComment } from "modules/posts/types/postTypes";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    postDetail: null,
    postComments: [],
  } as {
    posts: IPost[];
    postDetail: IPost | null;
    postComments: IPostComment[];
  },
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    setPostDetail: (state, action: PayloadAction<IPost | null>) => {
      state.postDetail = action.payload;
    },
    setPostComments: (state, action: PayloadAction<IPostComment[]>) => {
      state.postComments = action.payload;
    },
    addPost: (
      state,
      action: PayloadAction<{ post: IPost; userProfileId?: number }>
    ) => {
      if (
        !action.payload.userProfileId ||
        action.payload.userProfileId === action.payload.post.from_user_id
      ) {
        state.posts.unshift(action.payload.post);
      }
    },
    addComment: (state, action: PayloadAction<IPostComment>) => {
      state.postComments.unshift(action.payload);
    },
    incrementLikes: (
      state,
      action: PayloadAction<{ view?: "item" | "detail"; post_id: number }>
    ) => {
      if (state.postDetail && action.payload.view === "detail") {
        const updatedPost = {
          ...state.postDetail,
          total_likes: state.postDetail.total_likes + 1,
        };
        state.postDetail = updatedPost;
      } else if (action.payload.view === "item") {
        const updatedPosts = state.posts.map((post) =>
          post.post_id === action.payload.post_id
            ? { ...post, total_likes: post.total_likes + 1 }
            : post
        );
        state.posts = updatedPosts;
      }
    },
    decreaseLikes: (
      state,
      action: PayloadAction<{ view?: "item" | "detail"; post_id: number }>
    ) => {
      if (state.postDetail && action.payload.view === "detail") {
        const updatedPost = {
          ...state.postDetail,
          total_likes: state.postDetail.total_likes - 1,
        };
        state.postDetail = updatedPost;
      } else if (action.payload.view === "item") {
        const updatedPosts = state.posts.map((post) =>
          post.post_id === action.payload.post_id
            ? { ...post, total_likes: post.total_likes - 1 }
            : post
        );
        state.posts = updatedPosts;
      }
    },
    incrementComments: (state) => {
      if (state.postDetail) {
        const updatedPost = {
          ...state.postDetail,
          total_comments: state.postDetail.total_comments + 1,
        };
        state.postDetail = updatedPost;
      }
    },
  },
});

export const {
  setPosts,
  setPostDetail,
  setPostComments,
  addPost,
  addComment,
  incrementLikes,
  decreaseLikes,
  incrementComments,
} = postsSlice.actions;
export default postsSlice.reducer;
