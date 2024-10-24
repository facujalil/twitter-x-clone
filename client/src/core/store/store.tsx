import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice";
import postsSlice from "./postsSlice";

const store = configureStore({
  reducer: {
    users: usersSlice,
    posts: postsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
