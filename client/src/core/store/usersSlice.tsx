import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { token } from "core/utils/localStorage";
import { IAuthUser, IUserProfile } from "modules/users/types/userTypes";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    token: token,
    authUser: null,
    userProfile: null,
  } as {
    token: string | null;
    authUser: IAuthUser | null;
    userProfile: IUserProfile | null;
  },
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setAuthUser: (state, action: PayloadAction<IAuthUser>) => {
      state.authUser = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<IUserProfile | null>) => {
      state.userProfile = action.payload;
    },
    resetUnreadNotifications: (state) => {
      if (state.authUser) {
        state.authUser = {
          ...state.authUser,
          unread_notifications: 0,
        };
      }
    },
    addFollow: (
      state,
      action: PayloadAction<{ following_id: number; follower_id: number }>
    ) => {
      if (state.userProfile) {
        if (state.userProfile.user_id === action.payload.following_id) {
          state.userProfile.followers.push({
            follower_id: action.payload.follower_id,
          });
        } else if (state.userProfile.user_id === action.payload.follower_id) {
          state.userProfile.following.push({
            following_id: action.payload.following_id,
          });
        }
      }
      if (state.authUser) {
        state.authUser.following.push({
          following_id: action.payload.following_id,
        });
      }
    },
    removeFollow: (
      state,
      action: PayloadAction<{ following_id: number; follower_id: number }>
    ) => {
      if (state.userProfile) {
        if (state.userProfile.user_id === action.payload.following_id) {
          const updatedProfileUser = {
            ...state.userProfile,
            followers: state.userProfile.followers.filter(
              (user) => user.follower_id !== action.payload.follower_id
            ),
          };
          state.userProfile = updatedProfileUser;
        } else if (state.userProfile.user_id === action.payload.follower_id) {
          const updatedProfileUser = {
            ...state.userProfile,
            following: state.userProfile.following.filter(
              (user) => user.following_id !== action.payload.following_id
            ),
          };
          state.userProfile = updatedProfileUser;
        }
      }
      if (state.authUser) {
        const updatedAuthUser = {
          ...state.authUser,
          following: state.authUser.following.filter(
            (user) => user.following_id !== action.payload.following_id
          ),
        };
        state.authUser = updatedAuthUser;
      }
    },
    addLikedPost: (state, action: PayloadAction<number>) => {
      if (state.authUser) {
        const updatedAuthUser = {
          ...state.authUser,
          liked_posts: [
            ...state.authUser.liked_posts,
            { liked_post_id: action.payload },
          ],
        };
        state.authUser = updatedAuthUser;
      }
    },
    removeLikedPost: (state, action: PayloadAction<number>) => {
      if (state.authUser) {
        const updatedAuthUser = {
          ...state.authUser,
          liked_posts: [
            ...state.authUser.liked_posts.filter(
              (post) => post.liked_post_id !== action.payload
            ),
          ],
        };
        state.authUser = updatedAuthUser;
      }
    },
    logout: (state) => {
      state.token = null;
      state.authUser = null;
    },
  },
});

export const {
  setToken,
  setAuthUser,
  setUserProfile,
  resetUnreadNotifications,
  addFollow,
  removeFollow,
  addLikedPost,
  removeLikedPost,
  logout,
} = usersSlice.actions;
export default usersSlice.reducer;
