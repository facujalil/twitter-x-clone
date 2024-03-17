export type TImageUpload = {
  preview: string;
  data: Blob | null;
};

interface IUser {
  profile_picture: string;
  username: string;
  display_name: string;
}

export interface ILoggedInUser extends IUser {
  cover_picture: string;
  unread_notifications: number;
  following_list: {
    following_id: number;
  }[];
  followers_list: {
    follower_id: number;
  }[];
  liked_posts_list: {
    liked_post_id: number;
  }[];
}

export interface IUserProfile extends IUser {
  user_id: number;
  cover_picture: string;
  biography: string;
  user_creation_date: string;
  following_list: {
    following_id: number;
  }[];
  followers_list: {
    follower_id: number;
  }[];
}

export interface IRecommendedUser extends IUser {
  user_id: number;
  following_list: {
    following_id: number;
  }[];
}

export interface IPost extends IUser {
  post_id: number;
  from_user_id: number;
  post_text: string;
  post_creation_date: number;
  post_elapsed_time: number;
  total_likes: number;
  total_comments: number;
}

export interface IPostComment extends IUser {
  comment_id: number;
  from_user_id: number;
  comment_text: string;
  comment_creation_date: number;
  comment_elapsed_time: number;
}

export interface INotification {
  notification_id: number;
  from_user_id: number;
  type: string;
  post_id: number;
  from_username: string;
}
