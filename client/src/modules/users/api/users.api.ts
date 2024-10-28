export const editProfile = async (userId: number, formData: FormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/edit-profile/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }
};

export const getAuthUser = async (userId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/auth-user/${userId}`,
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

export const getUserProfile = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/user-profile/${userId}`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const getRecommendedUsers = async (userId?: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/recommended-users/${
      userId || 0
    }`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const getNotifications = async (userId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/notifications/${userId}`,
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

export const markNotificationsAsRead = async (userId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/mark-notifications-as-read/${userId}`,
    {
      method: "PUT",
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
};

export const followUser = async (followerId: number, followingId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/follow-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followerId: followerId,
        followingId: followingId,
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

export const unfollowUser = async (followerId: number, followingId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/unfollow-user",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followerId: followerId,
        followingId: followingId,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }
};
