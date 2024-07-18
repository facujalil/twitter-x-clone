import { token } from "../utils/localStorage";

export const registerUser = async (
  email: string,
  displayName: string,
  username: string,
  password: string
) => {
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/register-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        displayName: displayName,
        username: username,
        password: password,
      }),
    }
  );
  const data = await res.json();
  return data;
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/login-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }
  );
  if (res.status === 200) {
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data;
  }
};

export const editProfile = async (userId: number, formData: FormData) => {
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
  const data = await res.json();
  return data;
};

export const getUserData = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/user-data/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await res.json();
  if (res.status === 200) {
    return data;
  }
};

export const getUserProfileData = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/user-profile-data/${userId}`
  );
  const data = await res.json();
  if (res.status === 200) {
    return data;
  }
};

export const getRecommendedUsers = async (userId: number) => {
  const res = await fetch(
    `https://twitter-x-clone-production.up.railway.app/api/users/recommended-users/${userId}`
  );
  const data = await res.json();
  return data;
};

export const getNotifications = async (userId: number) => {
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
  const data = await res.json();
  return data;
};

export const clearNotifications = async (userId: number) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/clear-notifications",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        toUserId: userId,
        Authorization: "Bearer " + token,
      }),
    }
  );
};

export const followUser = async (userId: number, followingId: number) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/follow-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followerId: userId,
        followingId: followingId,
      }),
    }
  );
};

export const unfollowUser = async (userId: number, followingId: number) => {
  await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/users/unfollow-user",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followerId: userId,
        followingId: followingId,
      }),
    }
  );
};
