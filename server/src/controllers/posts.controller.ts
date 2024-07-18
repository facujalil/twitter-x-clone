import { Request, Response } from "express";
import { pool } from "../db/connection";

export const getPostsFromHome = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  try {
    const { rows: followingList } = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = $1",
      [userId]
    );
    const { rows: postList } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.profile_picture, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE posts.from_user_id = ANY($1) OR posts.from_user_id = $2 ORDER BY posts.post_creation_date DESC",
      [
        followingList.map(
          (following: { following_id: number }) => following.following_id
        ),
        userId,
      ]
    );
    return res.json(postList);
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getPostsFromProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  try {
    const { rows: postList } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.profile_picture, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE users.user_id = $1 ORDER BY posts.post_creation_date DESC",
      [userId]
    );
    return res.json(postList);
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getPostDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { postId } = req.params;
  try {
    const { rows: post } = await pool.query(
      "SELECT posts.post_id, posts.from_user_id, posts.post_text, posts.post_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - posts.post_creation_date)) as post_elapsed_time, posts.total_likes, posts.total_comments, users.profile_picture, users.username, users.display_name FROM posts JOIN users ON posts.from_user_id = users.user_id WHERE posts.post_id = $1",
      [postId]
    );
    if (post[0]) {
      return res.json(post[0]);
    } else {
      return res.status(404).json({ message: "post not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const uploadPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fromUserId, postText } = req.body as {
    fromUserId: number;
    postText: string;
  };
  try {
    await pool.query(
      "INSERT INTO posts(from_user_id, post_text) VALUES($1, $2)",
      [fromUserId, postText]
    );
    return res.json({
      message: "added post!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const getPostComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { postId } = req.params;
  try {
    const { rows: postCommentsList } = await pool.query(
      "SELECT comments.comment_id, comments.from_user_id, comments.commented_post_id, comments.comment_text, comments.comment_creation_date, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - comments.comment_creation_date)) as comment_elapsed_time, users.profile_picture, users.username, users.display_name FROM comments JOIN users ON comments.from_user_id = users.user_id WHERE comments.commented_post_id = $1 ORDER BY comments.comment_creation_date DESC",
      [postId]
    );
    return res.json(postCommentsList);
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const commentPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fromUserId, toUserId, postId, commentText } = req.body;
  try {
    await pool.query(
      "INSERT INTO comments(from_user_id, to_user_id, commented_post_id, comment_text) VALUES($1, $2, $3, $4)",
      [fromUserId, toUserId, postId, commentText]
    );
    return res.json({
      message: "comment added!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const likePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fromUserId, toUserId, postId } = req.body;
  try {
    await pool.query(
      "INSERT INTO likes(from_user_id, to_user_id, liked_post_id) VALUES($1, $2, $3)",
      [fromUserId, toUserId, postId]
    );
    return res.json({
      message: "like sent!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};

export const removeLikeFromPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fromUserId, postId } = req.body;
  try {
    await pool.query(
      "DELETE FROM likes WHERE from_user_id = $1 AND liked_post_id = $2",
      [fromUserId, postId]
    );
    return res.json({ message: "like removed!" });
  } catch (error) {
    return res.status(500).json({
      message: "something goes wrong",
    });
  }
};
