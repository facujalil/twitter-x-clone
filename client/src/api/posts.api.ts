import { token } from "../utils/localStorage";

export const getPostsFromHome = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/posts-from-home/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const getPostsFromProfile = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/posts-from-profile/${userId}`
  );
  const data = await res.json();
  return data;
};

export const getPostDetail = async (postId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/post-detail/${postId}`
  );

  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
};

export const uploadPost = async (userId: number, postText: string) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/upload-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: userId,
        postText: postText,
      }),
    }
  );
};

export const getPostComments = async (postId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/post-comments/${postId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const commentPost = async (
  userId: number,
  toUserId: number,
  postId: number,
  commentText: string
) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/comment-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: userId,
        toUserId: toUserId,
        postId: postId,
        commentText: commentText,
      }),
    }
  );
};

export const likePost = async (
  userId: number,
  toUserId: number,
  postId: number
) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/like-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: userId,
        toUserId: Number(toUserId),
        postId: postId,
      }),
    }
  );
};

export const removeLikeFromPost = async (
  userId: number,
  toUserId: number,
  postId: number
) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/remove-like-from-post",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: userId,
        toUserId: toUserId,
        postId: postId,
      }),
    }
  );
};
