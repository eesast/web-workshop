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
  if (!username) {
    return res.status(422).send("422 Unprocessable Entity: Missing username");
  }

  try {
    // 检查用户是否存在
    const queryResult = await graphql.getUsersByUsername({ username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];

    // 生成JWT token
    const resetToken = jwt.sign(
      { uuid: user.uuid, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // 发送重置邮件
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    if (!user.email) {
      return res.status(400).send("400 Bad Request: User has no email address");
    }
    await sendEmail(
      user.email,

      "Password Reset Request",
      `Please use the following link to reset your password: ${resetUrl}
      This link is valid for 1 hour.`
    );

    return res.status(200).send("Password reset email sent");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

// 添加密码重置执行路由
router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(422).send("422 Unprocessable Entity: Missing token or newPassword");
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uuid: string };

    // 更新密码
    await graphql.updateUserPassword({
      uuid: decoded.uuid,
      newPassword
    });

    return res.status(200).send("Password updated successfully");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("401 Unauthorized: Invalid or expired token");
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
