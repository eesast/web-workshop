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
      return next();
    });
  };

export default authenticate;
