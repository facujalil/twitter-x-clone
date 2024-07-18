import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  editProfile,
  followUser,
  getRecommendedUsers,
  getUserData,
  getUserProfileData,
  loginUser,
  registerUser,
  unfollowUser,
  getNotifications,
  clearNotifications,
} from "../controllers/users.controller";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    cb(null, `image${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({ storage: storage });

router.post("/api/users/register-user", registerUser);

router.post("/api/users/login-user", loginUser);

router.put(
  "/api/users/edit-profile/:userId",
  authenticateToken,
  upload.array("files"),
  editProfile
);

router.get("/api/users/user-data/:userId", authenticateToken, getUserData);

router.get("/api/users/user-profile-data/:userId", getUserProfileData);

router.get("/api/users/recommended-users/:userId", getRecommendedUsers);

router.get(
  "/api/users/notifications/:userId",
  authenticateToken,
  getNotifications
);

router.put(
  "/api/users/clear-notifications",
  authenticateToken,
  clearNotifications
);

router.post("/api/users/follow-user", authenticateToken, followUser);

router.delete("/api/users/unfollow-user", authenticateToken, unfollowUser);

export default router;
