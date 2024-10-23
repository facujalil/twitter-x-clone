import { Request, Response } from "express";
import { pool } from "../db/connection";
import cloudinary from "../utils/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

export const editProfile = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { userId } = req.params;
  const {
    previousCoverFile,
    previousAvatarFile,
    displayName,
    previousUsername,
    username,
    biography,
  } = req.body;
  const [coverFile] = files.filter(
    (file) => file.originalname === "cover-file"
  );
  const [avatarFile] = files.filter(
    (file) => file.originalname === "avatar-file"
  );
  const {
    rows: [usernameExists],
  } = await pool.query(
    "SELECT user_id, username FROM users WHERE username = $1",
    [username]
  );
  try {
    if (previousUsername !== username && usernameExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
    if (coverFile) {
      const { secure_url } = await cloudinary.uploader.upload(coverFile.path);
      await pool.query("UPDATE users SET cover = $1 WHERE user_id = $2", [
        secure_url,
        userId,
      ]);
      const avatarPublicId = previousCoverFile
        ? extractPublicId(previousCoverFile)
        : null;
      avatarPublicId
        ? await cloudinary.uploader.destroy(avatarPublicId, {
            invalidate: true,
          })
        : null;
    }
    if (avatarFile) {
      const { secure_url } = await cloudinary.uploader.upload(avatarFile.path);
      await pool.query("UPDATE users SET avatar = $1 WHERE user_id = $2", [
        secure_url,
        userId,
      ]);
      const avatarPublicId = avatarFile
        ? extractPublicId(previousAvatarFile)
        : null;
      avatarPublicId
        ? await cloudinary.uploader.destroy(avatarPublicId, {
            invalidate: true,
          })
        : null;
    }
    await pool.query(
      "UPDATE users SET display_name = $1, username = $2, biography = $3 WHERE user_id = $4",
      [displayName, username, biography, userId]
    );
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  let data = {};
  try {
    const {
      rows: [user],
    } = await pool.query(
      "SELECT user_id, avatar, username, display_name FROM users WHERE user_id = $1",
      [userId]
    );
    const {
      rows: [unreadNotifications],
    } = await pool.query(
      "SELECT COUNT(is_read) AS unread_notifications FROM notifications WHERE to_user_id = $1 AND is_read = false",
      [userId]
    );
    const { rows: following } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: followers } = await pool.query(
      "SELECT follower_id FROM followers WHERE following_id = $1",
      [userId]
    );
    const { rows: likedPosts } = await pool.query(
      "SELECT liked_post_id FROM likes WHERE from_user_id = $1",
      [userId]
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    data = Object.assign(
      user,
      unreadNotifications,
      { followers: followers },
      { following: following },
      { liked_posts: likedPosts }
    );
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  let data = {};
  try {
    const {
      rows: [user],
    } = await pool.query(
      "SELECT user_id, avatar, cover, username, display_name, biography, user_creation_date FROM users WHERE user_id = $1",
      [userId]
    );
    const { rows: following } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: followers } = await pool.query(
      "SELECT follower_id FROM followers WHERE following_id = $1",
      [userId]
    );
    const { rows: likedPosts } = await pool.query(
      "SELECT liked_post_id FROM likes WHERE from_user_id = $1",
      [userId]
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    data = Object.assign(
      user,
      { followers: followers },
      { following: following },
      { liked_posts: likedPosts }
    );
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const data = [];
  try {
    const { rows: users } = await pool.query(
      "SELECT user_id, avatar, username, display_name FROM (SELECT DISTINCT user_id, avatar, username, display_name FROM users WHERE user_id != $1) AS unique_users ORDER BY RANDOM() LIMIT 3",
      [userId ? userId : 0]
    );
    for (let i = 0; i < users.length; i++) {
      const { rows: following } = await pool.query(
        "SELECT following_id FROM followers WHERE follower_id = $1",
        [users[i].user_id]
      );
      data.push(Object.assign(users[i], { following: following }));
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { rows: notifications } = await pool.query(
      "SELECT notifications.notification_id, notifications.from_user_id, notifications.to_user_id, notifications.type, notifications.post_id, notifications.comment_id, notifications.notification_creation_date, username AS from_username FROM notifications JOIN users ON notifications.from_user_id = users.user_id WHERE notifications.to_user_id = $1 ORDER BY notification_creation_date DESC",
      [userId]
    );
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const markNotificationsAsRead = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE to_user_id = $1",
      [userId]
    );
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const followUser = async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body;
  try {
    await pool.query(
      "INSERT INTO followers(follower_id, following_id) VALUES($1, $2)",
      [followerId, followingId]
    );
    return res.status(201).json({ following_id: followingId });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body;
  try {
    await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
