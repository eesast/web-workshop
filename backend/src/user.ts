import express from "express";
import jwt from "jsonwebtoken";
import {sendEmail}  from "./email";
import { sdk as graphql } from "./index";
import md5 from "md5";

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
    if (user.password !== md5(password)) {
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
    const mutationResult = await graphql.addUser({ username: username, password: md5(password) });
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

  // 1. 鲁棒性检查：输入参数检查
  if (!username) {
    return res.status(422).json({ error: "Missing username." });
  }

  try {
    const queryResult = await graphql.getUsersByUsername({ username });

    // 2. 鲁棒性检查：防止用户枚举攻击
    if (queryResult.user.length === 0) {
      return res.status(200).json({ message: "If a user with that username exists, a password reset link has been sent." });
    }

    const user = queryResult.user[0];
    const payload: userJWTPayload = {
      uuid: user.uuid,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "user",
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Token 有效期1小时
    });
     const resetLink = `http://localhost:3000/main.html#/user/change-password/action?token=${token}`;

    // 调用 sendEmail 函数
    await sendEmail(
      username,
      "密码重置",
      `请点击以下链接重置你的密码：${resetLink}`
    );

    // 同样，为防止用户枚举，即使发送失败也返回成功信息
    return res.status(200).json({ message: "If a user with that username exists, a password reset link has been sent." });
  } catch (err) {
    console.error("Error in /change-password/request:", err);
    // 增加一个更通用的服务器错误返回
    return res.status(500).json({ error: "Internal server error." });
  }
});


// 新增：重置密码路由
router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;

  // 1. 鲁棒性检查：输入参数检查
  if (!token || !newPassword) {
    return res.status(422).json({ error: "Missing token or new password." });
  }
  // 2. 鲁棒性检查：新密码的复杂度检查
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as userJWTPayload;
    const uuid = payload.uuid;

    // 3. 鲁棒性检查：验证token中的用户ID是否存在于数据库
    const userQueryResult = await graphql.getUsersByUuid({ uuid });
    if (userQueryResult.user.length === 0) {
        // 如果用户不存在，返回通用错误，不暴露用户ID
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
    }

    const hashedPassword = md5(newPassword);
    await graphql.updateUserPassword({ uuid: uuid, password: hashedPassword });

    return res.status(200).json({ message: "Password has been successfully reset." });
  } catch (err) {
    console.error("Error in /change-password/action:", err);
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized: Token has expired." });
    }
    // 处理其他JWT验证错误（如无效签名等）
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
