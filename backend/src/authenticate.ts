import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from 'apollo-server-express';


const authenticate: (req: Request, res: Response, next: NextFunction) => Response | void =
  (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send("401 Unauthorized: Missing Token");
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: new AuthenticationError("Invalid token format. Use: Bearer <token>").message,
        code: "INVALID_TOKEN_FORMAT"
      });
    }
    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({
        error: new AuthenticationError("Token cannot be empty").message,
        code: "EMPTY_TOKEN"
      });
    }
    return jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
       if (err) {

        let errorMessage = "Token expired or invalid";
        let errorCode = "INVALID_TOKEN";

        if (err.name === 'TokenExpiredError') {
          errorMessage = "Token has expired";
          errorCode = "TOKEN_EXPIRED";
        } else if (err.name === 'JsonWebTokenError') {
          errorMessage = "Invalid token signature";
          errorCode = "INVALID_SIGNATURE";
        }
        return res.status(401).send("401 Unauthorized: Token expired or invalid");
      }
      if (!decoded) {
        return res.status(401).json({
          error: new AuthenticationError("Token could not be decoded").message,
          code: "DECODING_FAILED"
        });
      }

      if (typeof decoded !== 'object' || !decoded) {
        return res.status(401).json({
          error: new AuthenticationError("Invalid token payload").message,
          code: "INVALID_PAYLOAD"
        });
      }
      return next();
    });
  };

export default authenticate;
