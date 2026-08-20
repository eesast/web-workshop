import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const authenticate: (req: Request, res: Response, next: NextFunction) => Response | void =
  (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send("401 Unauthorized: Missing Token");
    }

    const match = /^Bearer\s+(\S+)$/i.exec(authHeader);
    if (!match) {
      return res.status(401).send("401 Unauthorized: Malformed Authorization header");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured");
      return res.sendStatus(500);
    }

    try {
      const decoded = jwt.verify(match[1], secret);
      if (
        typeof decoded === "string" ||
        typeof decoded.uuid !== "string" ||
        !UUID_PATTERN.test(decoded.uuid)
      ) {
        return res.status(401).send("401 Unauthorized: Token payload is invalid");
      }

      res.locals.userUuid = decoded.uuid;
      return next();
    } catch (_err) {
      return res.status(401).send("401 Unauthorized: Token expired or invalid");
    }
  };

export default authenticate;
