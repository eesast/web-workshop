import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import  {sendEmail}  from "./email";

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

router.post("/change-password/request", async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== "string") {
    return res.status(422).json({ error: "Missing username" });
  }

  try {
    // 若用户名为邮箱，做基础格式校验（非强制）
    const email = username.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // 若不是邮箱也允许请求，但返回同样的信息以避免信息泄露
      // 这里只做提示，不拒绝请求
    }

    // 查询用户（不暴露是否存在）
    const queryResult = await graphql.getUsersByUsername({ username });
    const userExists = Array.isArray(queryResult.user) && queryResult.user.length > 0;
    if (!userExists) {
      // 安全考虑，不暴露用户是否存在
      return res.status(200).json({ message: "If that account exists, a reset link has been sent" });
    }
    const user = queryResult.user[0];

    // 生成短期 JWT，包含最小必要信息
    const secret = process.env.JWT_SECRET!;
    if (!secret) return res.status(500).json({ error: "Server configuration error" });

    const resetToken = jwt.sign(
      { uuid: user.uuid },
      secret,
      { expiresIn: "1h" }
    );

    const resetUrlBase = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "http://localhost:3000";
    const resetUrl = `${resetUrlBase}/reset-password?token=${encodeURIComponent(resetToken)}`;

    // 发送邮件（sendEmail 已存在）
    if (user.email) {
      await sendEmail(
        user.email,
        "Password Reset Request",
        `Please use the following link to reset your password: ${resetUrl}\nThis link is valid for 1 hour.`
      );
    }
    // 即使没有 email 也返回同样消息，避免泄露信息
    return res.status(200).json({ message: "If that account exists, a reset link has been sent" });
  } catch (err) {
    console.error("change-password/request error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 添加密码重置执行路由（保持与 register 存储格式兼容）
router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(422).json({ error: "Missing or invalid token" });
  }
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(422).json({ error: "newPassword must be a string with at least 8 characters" });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    if (!secret) return res.status(500).json({ error: "Server configuration error" });

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!decoded || !decoded.uuid) {
      return res.status(400).json({ error: "Token missing user info" });
    }

    // 更新密码（保持原有 register 的存储格式，不改 register）
    await graphql.updateUserPassword({
      uuid: decoded.uuid,
      newPassword
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("change-password/action error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
