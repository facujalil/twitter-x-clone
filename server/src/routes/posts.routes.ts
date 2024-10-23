import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  commentPost,
  createPost,
  getHomePosts,
  getPostComments,
  getPostDetail,
  getProfilePosts,
  likePost,
  unlikePost,
} from "../controllers/posts.controller";

const router = Router();

router.get("/api/posts/home-posts/:userId", authenticateToken, getHomePosts);

router.get("/api/posts/profile-posts/:userId", getProfilePosts);

router.get("/api/posts/post-detail/:postId", getPostDetail);

router.post("/api/posts/create-post", authenticateToken, createPost);

router.get("/api/posts/post-comments/:postId", getPostComments);

router.post("/api/posts/comment-post", authenticateToken, commentPost);

router.post("/api/posts/like-post", authenticateToken, likePost);

router.delete("/api/posts/unlike-post", authenticateToken, unlikePost);

export default router;
