import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "no token provided" });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET!, (error, decoded) => {
    if (error) {
      res.status(403).json({ message: "invalid token" });
      return;
    }
    req.user = decoded;
    next();
  });
};
