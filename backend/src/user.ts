import express from "express";
import jwt from "jsonwebtoken";
import { sdk } from "./index";

const router = express.Router();

// 用户登录
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "用户名和密码不能为空" });
    }

    // 查询用户
    const result = await sdk.GetUserByUsername({ username });
    
    if (!result.user || result.user.length === 0) {
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    const user = result.user[0];
    
    // 验证密码 (这里使用简单的MD5比较，实际应该使用bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.uuid,
        username: user.username,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": user.uuid
        }
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.json({
      message: "登录成功",
      token,
      user: {
        uuid: user.uuid,
        username: user.username
      }
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 用户注册
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "用户名和密码不能为空" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "密码长度至少6位" });
    }

    // 检查用户是否已存在
    const existingUser = await sdk.GetUserByUsername({ username });
    
    if (existingUser.user && existingUser.user.length > 0) {
      return res.status(409).json({ error: "用户名已存在" });
    }

    // 创建新用户
    const result = await sdk.CreateUser({ username, password });
    
    if (!result.insert_user_one) {
      return res.status(500).json({ error: "用户创建失败" });
    }

    const newUser = result.insert_user_one;

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: newUser.uuid,
        username: newUser.username,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": newUser.uuid
        }
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "注册成功",
      token,
      user: {
        uuid: newUser.uuid,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 密码重置请求
router.post("/change-password/request", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "用户名不能为空" });
    }

    // 检查用户是否存在
    const result = await sdk.GetUserByUsername({ username });
    
    if (!result.user || result.user.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    const user = result.user[0];

    // 生成重置token
    const resetToken = jwt.sign(
      { 
        userId: user.uuid,
        username: user.username,
        type: "password_reset"
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // 这里应该发送邮件，暂时返回token用于测试
    res.json({
      message: "密码重置链接已发送",
      resetToken // 实际应用中不应该返回token
    });
  } catch (error) {
    console.error("密码重置请求错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 密码重置执行
router.post("/change-password/action", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "token和新密码不能为空" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "密码长度至少6位" });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type !== "password_reset") {
      return res.status(400).json({ error: "无效的token类型" });
    }

    // 更新密码
    const result = await sdk.UpdateUserPassword({ 
      uuid: decoded.userId, 
      password: newPassword 
    });

    if (!result.update_user_by_pk) {
      return res.status(500).json({ error: "密码更新失败" });
    }

    res.json({ message: "密码重置成功" });
  } catch (error) {
    console.error("密码重置执行错误:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: "无效的token" });
    }
    res.status(500).json({ error: "服务器错误" });
  }
});

// 删除用户
router.delete("/delete", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "未提供认证token" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 删除用户
    const result = await sdk.DeleteUser({ uuid: decoded.userId });

    if (!result.delete_user_by_pk) {
      return res.status(500).json({ error: "用户删除失败" });
    }

    res.json({ message: "用户删除成功" });
  } catch (error) {
    console.error("删除用户错误:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "无效的token" });
    }
    res.status(500).json({ error: "服务器错误" });
  }
});

// 获取用户信息
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "未提供认证token" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 获取用户信息
    const result = await sdk.GetUserById({ uuid: decoded.userId });

    if (!result.user_by_pk) {
      return res.status(404).json({ error: "用户不存在" });
    }

    const user = result.user_by_pk;
    res.json({
      user: {
        uuid: user.uuid,
        username: user.username
      }
    });
  } catch (error) {
    console.error("获取用户信息错误:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "无效的token" });
    }
    res.status(500).json({ error: "服务器错误" });
  }
});

export default router;
