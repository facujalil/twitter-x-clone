import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  editProfile,
  followUser,
  getRecommendedUsers,
  getAuthUser,
  getUserProfile,
  unfollowUser,
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/users.controller";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    cb(null, `image${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({ storage: storage });

router.put(
  "/api/users/edit-profile/:userId",
  authenticateToken,
  upload.array("files"),
  editProfile
);

router.get("/api/users/auth-user/:userId", authenticateToken, getAuthUser);

router.get("/api/users/user-profile/:userId", getUserProfile);

router.get("/api/users/recommended-users/:userId", getRecommendedUsers);

router.get(
  "/api/users/notifications/:userId",
  authenticateToken,
  getNotifications
);

router.put(
  "/api/users/mark-notifications-as-read/:userId",
  authenticateToken,
  markNotificationsAsRead
);

router.post("/api/users/follow-user", authenticateToken, followUser);

router.delete("/api/users/unfollow-user", authenticateToken, unfollowUser);

export default router;
