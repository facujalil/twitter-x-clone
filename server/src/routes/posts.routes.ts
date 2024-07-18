import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  uploadPost,
  getPostDetail,
  getPostsFromProfile,
  getPostsFromHome,
  likePost,
  removeLikeFromPost,
  getPostComments,
  commentPost,
} from "../controllers/posts.controller";

const router = Router();

router.get(
  "/api/posts/posts-from-home/:userId",
  authenticateToken,
  getPostsFromHome
);

router.get("/api/posts/posts-from-profile/:userId", getPostsFromProfile);

router.get("/api/posts/post-detail/:postId", getPostDetail);

router.post("/api/posts/upload-post", authenticateToken, uploadPost);

router.get("/api/posts/post-comments/:postId", getPostComments);

router.post("/api/posts/comment-post", authenticateToken, commentPost);

router.post("/api/posts/like-post", authenticateToken, likePost);

router.delete(
  "/api/posts/remove-like-from-post",
  authenticateToken,
  removeLikeFromPost
);

export default router;
