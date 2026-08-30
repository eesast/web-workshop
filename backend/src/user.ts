import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import authenticate from "./authenticate";
import { sendEmail } from "./email";

interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// 发送密码重置邮件
router.post("/change-password/request", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(422).send("422 Unprocessable Entity: Missing username");
  }
  // 本路由只对"用户名为邮箱"的用户开放
  if (!EMAIL_REGEX.test(username)) {
    return res.status(422).send("422 Unprocessable Entity: Username is not an email address");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];
    // 用 JWT 签名用户信息，作为重置链接中的身份凭证
    const token = jwt.sign(
      { uuid: user.uuid, purpose: "change-password" },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" }
    );
    const link = `${process.env.FRONTEND_URL ?? "http://localhost:8000"}/reset-password.html?token=${token}`;
    await sendEmail(
      username,
      "Web Workshop Password Reset",
      `You are receiving this email because you (or someone else) requested a password reset.\n\n` +
        `If it was you, click the link below to reset your password (valid for 30 minutes):\n` +
        `${link}\n\n` +
        `If it was not you, please ignore this email.`
    );
    return res.send("Password reset email sent");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

// 验证 token 并修改密码
router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(422).send("422 Unprocessable Entity: Missing token or newPassword");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string" || !decoded.uuid || decoded.purpose !== "change-password") {
      return res.status(401).send("401 Unauthorized: Token is not a password reset token");
    }
    const mutationResult = await graphql.updateUserPassword({
      uuid: decoded.uuid,
      password: newPassword,
    });
    if (!mutationResult.update_user_by_pk) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    return res.send("Password changed successfully");
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("401 Unauthorized: Token expired or invalid");
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

// 删除用户
router.get("/delete", authenticate, async (req, res) => {
  try {
    // authenticate 已验证 token 签名，这里只需解码取出用户信息
    const token = req.get("Authorization")!.substring(7);
    const payload = jwt.decode(token) as userJWTPayload;
    const mutationResult = await graphql.deleteUser({ uuid: payload.uuid });
    if (!mutationResult.delete_user_by_pk) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    return res.send("User deleted successfully");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
