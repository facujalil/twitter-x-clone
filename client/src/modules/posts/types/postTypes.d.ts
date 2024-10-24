import { IUser } from "modules/users/types/userTypes";

export interface IPost extends IUser {
  post_id: number;
  from_user_id: number;
  post_text: string;
  post_creation_date: string;
  post_elapsed_time: number;
  total_likes: number;
  total_comments: number;
}

export interface IPostComment extends IUser {
  comment_id: number;
  from_user_id: number;
  comment_text: string;
  comment_creation_date: string;
  comment_elapsed_time: number;
}
