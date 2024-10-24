export const getHomePosts = async (userId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/home-posts/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const getProfilePosts = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/profile-posts/${userId}`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const getPostDetail = async (postId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/posts/post-detail/${postId}`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const createPost = async (userId: number, postText: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/create-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        postText: postText,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
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
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const commentPost = async (
  fromUserId: number,
  toUserId: number,
  postId: number,
  commentText: string
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/comment-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: fromUserId,
        toUserId: toUserId,
        postId: postId,
        commentText: commentText,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const likePost = async (
  fromUserId: number,
  toUserId: number,
  postId: number
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/like-post",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fromUserId: fromUserId,
        toUserId: toUserId,
        postId: postId,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const unlikePost = async (userId: number, postId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/posts/unlike-post",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }
};
