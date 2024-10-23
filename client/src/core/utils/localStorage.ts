import { parseJwt } from "./parseJwt";

export const token = localStorage.getItem("token");

export const authUserId: number | null =
  token && parseJwt(token).exp * 1000 > Date.now()
    ? parseJwt(token).user_id
    : null;
