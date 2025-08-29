import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";

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

  // 检查必需字段
  if (!username || !password) {
    return res.status(422).json({
      error: "Missing credentials",
      message: "Username and password are required"
    });
  }

  try {
    // 查询用户
    const queryResult = await graphql.getUsersByUsername({ username: username });

    // 用户不存在
    if (queryResult.user.length === 0) {
      // 出于安全考虑，不明确提示用户不存在
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid username or password"
      });
    }

    const user = queryResult.user[0];

    // 密码不匹配
    if (user.password !== password) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid username or password"
      });
    }

    // 生成JWT令牌
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

    // 成功响应
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uuid: user.uuid,
        username: username
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred during login"
    });
  }
});

// 注册路由保持不变
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({
      error: "Missing credentials",
      message: "Username and password are required"
    });
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length !== 0) {
      return res.status(409).json({
        error: "User exists",
        message: "A user with this username already exists"
      });
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
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        uuid: mutationResult.insert_user_one?.uuid,
        username: username
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred during registration"
    });
  }
});

export default router;
