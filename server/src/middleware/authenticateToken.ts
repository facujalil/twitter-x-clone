import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  } else if (process.env.JWT_SECRET) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      req.user = decoded;
      return next();
    });
  }
  return;
};
