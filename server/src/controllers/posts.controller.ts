import { Request, Response } from "express";
import { pool } from "../db/connection";

export const getHomePosts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { rows: following } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: posts } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.avatar, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE posts.from_user_id = ANY($1) OR posts.from_user_id = $2 ORDER BY posts.post_creation_date DESC",
      [
        following.map(
          (following: { following_id: number }) => following.following_id
        ),
        userId,
      ]
    );
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getProfilePosts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { rows: posts } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.avatar, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE users.user_id = $1 ORDER BY posts.post_creation_date DESC",
      [userId]
    );
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getPostDetail = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const {
      rows: [post],
    } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.avatar, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE posts.post_id = $1",
      [postId]
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { userId, postText } = req.body;
  try {
    const {
      rows: [{ post_id }],
    } = await pool.query(
      "INSERT INTO posts(from_user_id, post_text) VALUES($1, $2) RETURNING post_id",
      [userId, postText]
    );
    return res.status(201).json({ post_id: post_id });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const { rows: postComments } = await pool.query(
      "SELECT comments.comment_id, comments.from_user_id, comments.commented_post_id, comments.comment_text, comments.comment_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - comments.comment_creation_date)) as comment_elapsed_time, users.avatar, users.username, users.display_name FROM comments JOIN users ON comments.from_user_id = users.user_id WHERE comments.commented_post_id = $1 ORDER BY comments.comment_creation_date DESC",
      [postId]
    );
    return res.json(postComments);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  const { fromUserId, toUserId, postId, commentText } = req.body;
  try {
    const {
      rows: [{ comment_id }],
    } = await pool.query(
      "INSERT INTO comments(from_user_id, to_user_id, commented_post_id, comment_text) VALUES($1, $2, $3, $4) RETURNING comment_id",
      [fromUserId, toUserId, postId, commentText]
    );
    return res.status(201).json({
      comment_id: comment_id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { fromUserId, toUserId, postId } = req.body;
  try {
    await pool.query(
      "INSERT INTO likes(from_user_id, to_user_id, liked_post_id) VALUES($1, $2, $3)",
      [fromUserId, toUserId, postId]
    );
    return res.status(201).json({ liked_post_id: postId });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  try {
    await pool.query(
      "DELETE FROM likes WHERE from_user_id = $1 AND liked_post_id = $2",
      [userId, postId]
    );
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
