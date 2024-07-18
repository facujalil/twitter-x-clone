import { parseJwt } from "./parseJwt";

export const token = localStorage.getItem("token");

export const loggedInUserId: number =
  token && parseJwt(token).exp * 1000 > Date.now()
    ? parseJwt(token).user_id
    : null;

export const tokenExpirationTime = token
  ? parseJwt(token).exp * 1000 - new Date().getTime()
  : null;
