import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller";

const router = Router();

router.post("/api/auth/sign-up", signUp);

router.post("/api/auth/login", login);

export default router;
