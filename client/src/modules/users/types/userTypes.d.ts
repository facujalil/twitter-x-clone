export type TImageUpload = {
  preview: string;
  data: Blob | null;
};

export interface IUser {
  avatar: string;
  username: string;
  display_name: string;
}

export interface IAuthUser extends IUser {
  unread_notifications: number;
  following: {
    following_id: number;
  }[];
  followers: {
    follower_id: number;
  }[];
  liked_posts: {
    liked_post_id: number;
  }[];
}

export interface IUserProfile extends IUser {
  user_id: number;
  cover: string;
  biography: string;
  user_creation_date: string;
  following: {
    following_id: number;
  }[];
  followers: {
    follower_id: number;
  }[];
}

export interface IRecommendedUser extends IUser {
  user_id: number;
  following: {
    following_id: number;
  }[];
}

export interface INotification {
  notification_id: number;
  from_user_id: number;
  type: string;
  post_id: number;
  from_username: string;
}
