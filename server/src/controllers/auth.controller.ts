import { Request, Response } from "express";
import { pool } from "../db/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  const { email, displayName, username, password } = req.body;
  try {
    const {
      rows: [emailExists],
    } = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    const {
      rows: [usernameExists],
    } = await pool.query("SELECT user_id FROM users WHERE username = $1", [
      username,
    ]);
    if (emailExists || usernameExists) {
      return res.status(409).json({
        message: emailExists
          ? "Email is already used."
          : "Username already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const {
      rows: [{ user_id }],
    } = await pool.query(
      "INSERT INTO users(email, display_name, username, password) VALUES($1, $2, $3, $4) RETURNING user_id",
      [email, displayName, username, hashedPassword]
    );
    return res.status(201).json({ user_id: user_id });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const {
      rows: [user],
    } = await pool.query(
      "SELECT user_id, password FROM users WHERE username = $1",
      [username]
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return res.json({ token: token });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
