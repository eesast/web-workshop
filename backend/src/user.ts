import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import { sendEmail } from "./email";

interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];
    if (user.password !== password) {
      return res.status(401).send("401 Unauthorized: Password does not match");
    }
    const payload: userJWTPayload = {
      uuid: user.uuid,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "user",
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length !== 0) {
      return res.status(409).send("409 Conflict: User already exists");
    }
    const mutationResult = await graphql.addUser({ username: username, password: password });
    const payload: userJWTPayload = {
      uuid: mutationResult.insert_user_one?.uuid,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "user",
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

router.post("/change-password/request", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(422).send("422 Unprocessable Entity: Missing username");
  }
  if (typeof username !== "string" || !isEmail(username)) {
    return res
      .status(400)
      .send("400 Bad Request: Username is not a valid email address");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];
    const token = jwt.sign(
      { uuid: user.uuid, username, type: "change-password" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const resetLink = `${frontendUrl}/#/reset-password?token=${token}`;
    const result = await sendEmail(
      username,
      "Web Workshop Password Reset",
      `Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
    );
    if (result.accepted.length === 0) {
      throw new Error("Failed to send email for unknown reason");
    }
    return res.send("Password reset email sent");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token) {
    return res.status(422).send("422 Unprocessable Entity: Missing token");
  }
  if (typeof newPassword !== "string" || newPassword.length === 0) {
    return res
      .status(422)
      .send("422 Unprocessable Entity: newPassword must not be empty");
  }
  let decoded: jwt.JwtPayload;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === "string") {
      return res.status(401).send("401 Unauthorized: Token invalid");
    }
    decoded = payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send("401 Unauthorized: Token expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("401 Unauthorized: Token invalid");
    }
    console.error(err);
    return res.sendStatus(500);
  }
  if (decoded.type !== "change-password" || !decoded.uuid) {
    return res.status(401).send("401 Unauthorized: Token invalid");
  }
  try {
    const result = await graphql.updateUserPassword({
      uuid: decoded.uuid,
      password: newPassword,
    });
    if (!result.update_user_by_pk) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    return res.send("Password changed successfully");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
