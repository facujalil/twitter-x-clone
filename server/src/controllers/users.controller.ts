import { Request, Response } from "express";
import { pool } from "../db/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, displayName, username, password } = req.body as {
    email: string;
    displayName: string;
    username: string;
    password: string;
  };
  try {
    const { rows: emailExists } = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    const { rows: usernameExists } = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );
    if (emailExists.length === 0 && usernameExists.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users(email, display_name, username, password) VALUES($1, $2, $3, $4)",
        [email, displayName, username, hashedPassword]
      );
      return res.json({ message: "registered user!" });
    } else {
      return res.json({
        message:
          emailExists.length > 0
            ? "email is already used"
            : "username already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  try {
    const { rows: user } = await pool.query(
      "SELECT user_id, password FROM users WHERE username = $1",
      [username]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (isMatch) {
      const token = jwt.sign(
        { user_id: user[0].user_id },
        process.env.JWT_SECRET!,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        }
      );
      return res.json({ token: token });
    } else {
      return res.status(401).json({ message: "incorrect password" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const editProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const files = req.files as Express.Multer.File[];
  const { userId } = req.params;
  const {
    previousCoverPictureFile,
    previousProfilePictureFile,
    displayName,
    previousUsername,
    username,
    biography,
  } = req.body as {
    previousCoverPictureFile: string;
    previousProfilePictureFile: string;
    displayName: string;
    previousUsername: string;
    username: string;
    biography: string;
  };
  const coverPictureFile = files.filter(
    (file) => file.originalname === "cover-picture-file"
  );
  const profilePictureFile = files.filter(
    (file) => file.originalname === "profile-picture-file"
  );
  const { rows: usernameExists } = await pool.query(
    "SELECT user_id, username FROM users WHERE username = $1",
    [username]
  );
  try {
    if (previousUsername === username || usernameExists.length === 0) {
      if (coverPictureFile[0]) {
        const { secure_url } = await cloudinary.uploader.upload(
          coverPictureFile[0].path
        );
        await pool.query(
          "UPDATE users SET cover_picture = $1 WHERE user_id = $2",
          [secure_url, userId]
        );

        const profilePicturePublicId = previousCoverPictureFile
          ? extractPublicId(previousCoverPictureFile)
          : null;
        profilePicturePublicId &&
          (await cloudinary.uploader.destroy(profilePicturePublicId, {
            invalidate: true,
          }));
      }
      if (profilePictureFile[0]) {
        const { secure_url } = await cloudinary.uploader.upload(
          profilePictureFile[0].path
        );
        await pool.query(
          "UPDATE users SET profile_picture = $1 WHERE user_id = $2",
          [secure_url, userId]
        );

        const profilePicturePublicId = profilePictureFile
          ? extractPublicId(previousProfilePictureFile)
          : null;
        profilePicturePublicId &&
          (await cloudinary.uploader.destroy(profilePicturePublicId, {
            invalidate: true,
          }));
      }
      await pool.query(
        "UPDATE users SET display_name = $1, username = $2, biography = $3 WHERE user_id = $4",
        [displayName, username, biography, userId]
      );
      return res.json({ message: "changes saved!" });
    } else {
      return res.json({ message: "username already exists" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getUserData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const data = [];
  try {
    const { rows: user } = await pool.query(
      "SELECT user_id, profile_picture, cover_picture, username, display_name FROM users WHERE user_id = $1",
      [userId]
    );
    const { rows: unreadNotifications } = await pool.query(
      "SELECT COUNT(is_read) AS unread_notifications FROM notifications WHERE to_user_id = $1 AND is_read = false",
      [userId]
    );
    const { rows: followingList } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: followersList } = await pool.query(
      "SELECT follower_id FROM followers WHERE following_id = $1",
      [userId]
    );
    const { rows: likedPostsList } = await pool.query(
      "SELECT liked_post_id FROM likes WHERE from_user_id = $1",
      [userId]
    );
    user[0] &&
      data.push(
        Object.assign(
          user[0],
          unreadNotifications[0],
          { followers_list: followersList },
          { following_list: followingList },
          { liked_posts_list: likedPostsList }
        )
      );
    if (data[0]) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getUserProfileData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const data = [];
  try {
    const { rows: user } = await pool.query(
      "SELECT user_id, profile_picture, cover_picture, username, display_name, biography, user_creation_date FROM users WHERE user_id = $1",
      [userId]
    );
    const { rows: followingList } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: followersList } = await pool.query(
      "SELECT follower_id FROM followers WHERE following_id = $1",
      [userId]
    );
    const { rows: likedPostsList } = await pool.query(
      "SELECT liked_post_id FROM likes WHERE from_user_id = $1",
      [userId]
    );
    user[0] &&
      data.push(
        Object.assign(
          user[0],
          { followers_list: followersList },
          { following_list: followingList },
          { liked_posts_list: likedPostsList }
        )
      );
    if (data[0]) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getRecommendedUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const data = [];
  try {
    const { rows: userList } = await pool.query(
      "SELECT user_id, profile_picture, username, display_name FROM (SELECT DISTINCT user_id, profile_picture, username, display_name FROM users WHERE user_id != $1) AS unique_users ORDER BY RANDOM() LIMIT 3",
      [userId]
    );
    for (let i = 0; i < userList.length; i++) {
      const { rows: followingList } = await pool.query(
        "SELECT following_id FROM followers WHERE follower_id = $1",
        [userList[i].user_id]
      );
      data.push(Object.assign(userList[i], { following_list: followingList }));
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  try {
    const { rows: notificationList } = await pool.query(
      "SELECT notifications.notification_id, notifications.from_user_id, notifications.to_user_id, notifications.type, notifications.post_id, notifications.comment_id, notifications.notification_creation_date, username AS from_username FROM notifications JOIN users ON notifications.from_user_id = users.user_id WHERE notifications.to_user_id = $1 ORDER BY notification_creation_date DESC",
      [userId]
    );
    return res.json(notificationList);
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const clearNotifications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { toUserId } = req.body as { toUserId: number };
  try {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE to_user_id = $1",
      [toUserId]
    );
    return res.json({ message: "notifications cleaned!" });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const followUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { followerId, followingId } = req.body as {
    followerId: number;
    followingId: number;
  };
  try {
    await pool.query(
      "INSERT INTO followers(follower_id, following_id) VALUES($1, $2)",
      [followerId, followingId]
    );
    return res.json({ message: "followed user!" });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { followerId, followingId } = req.body as {
    followerId: number;
    followingId: number;
  };
  try {
    await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );
    return res.json({ message: "follow removed!" });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};
