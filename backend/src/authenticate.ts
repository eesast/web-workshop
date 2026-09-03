import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate: (req: Request, res: Response, next: NextFunction) => Response | void =
  (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send("401 Unauthorized: Missing Token");
    }
    const token = authHeader.substring(7);
    return jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).send("401 Unauthorized: Token expired or invalid");
      }
      if (typeof decoded === "string") {
        return res.status(401).send("401 Unauthorized: Token payload is invalid");
      }
      const uuid = (decoded as { uuid?: string }).uuid;
      if (!uuid) {
        return res.status(401).send("401 Unauthorized: Token payload is missing uuid");
      }
      // 将 token 中的用户身份暴露给后续路由使用（如删除当前用户）
      res.locals.uuid = uuid;
      return next();
    });
  };

export default authenticate;
