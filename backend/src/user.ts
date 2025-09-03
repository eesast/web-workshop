import express from "express";
import jwt from "jsonwebtoken";
// import bcrypt from 'bcryptjs';
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

router.post("/change-password/request", async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(422).send("Missing username");
    }

    try {
        // 1. 检查用户是否存在
        const queryResult = await graphql.getUserByUsername({ username });
        if (queryResult.user.length === 0) {
            console.log(`Password reset requested for non-existent user: ${username}`);
            return res.status(200).send("If the email exists, a reset link has been sent.");
        }

        const user = queryResult.user[0];

        // 2. ★ 新增检查：确保用户名存在且是一个字符串
        if (!user.username || typeof user.username !== 'string') {
            console.error('User found but username is invalid:', user);
            // 仍然返回200，不透露具体信息
            return res.status(200).send('If the email exists, a reset link has been sent.');
        }

        // 2. 生成重置 Token
        const resetToken = jwt.sign(  // 不应该包含任何hasura-claims权限声明。它的唯一目的是验证身份，而不是授权访问。
            {
                uuid: user.uuid,
                username: user.username,
                purpose: "password_reset"
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        // 3. 构建重置链接
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // 4. 准备邮件内容
        const emailSubject = "重置您的密码"; // 邮件主题
        const emailText = `尊敬的${user.username}：我们收到了您重置密码的请求。请点击以下链接来重置您的密码（该链接15分钟内有效）：${resetLink}
                           如果您没有请求重置密码，请忽略此邮件。谢谢！`; // 邮件的纯文本内容

        // 5. 【核心】调用 sendEmail 函数发送邮件
        //await sendEmail(user.username, emailSubject, emailText);
        await sendEmail(process.env.EMAIL_ADDRESS!, emailSubject, emailText);

        // 6. 返回响应
        res.status(200).send("If the email exists, a reset link has been sent.");

    } catch (err) {
        console.error("Error in password reset request:", err);
        // 将 err 断言为具有 code 和 command 属性的对象
        const error = err as { code?: string; command?: string };
        // 特别处理邮件发送错误
        if (error.code === "EAUTH" || error.command === "API") {
            return res.status(500).send("Failed to send email. Please try again later.");
        }
        res.sendStatus(500);
    }
});

router.post("/change-password/action", async (req, res) => {
    const { token, newPassword } = req.body;

    // 1. 检查必要参数
    if (!token || !newPassword) {
        return res.status(422).send('Missing token or new password');
    }

    // 2. 验证密码长度（基本验证）
    if (newPassword.length < 8) {
        return res.status(422).send('Password must be at least 8 characters long');
    }

    try {
        // 3. 验证JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            uuid: string;
            username?: string;
            purpose?: string;
            iat?: number;
            exp?: number;
        };

        // 4. 安全检查：确认Token的用途是密码重置
        if (decoded.purpose !== 'password_reset') {
            console.warn(`Invalid token purpose attempt for user: ${decoded.uuid}`);
            return res.status(400).send('Invalid token purpose.');
        }

        // 5. 对新密码进行bcrypt哈希加密
        const saltRounds = 12;
        // const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // 6. 调用GraphQL mutation更新数据库中的密码
        const updateResult = await graphql.updateUserPassword({
            uuid: decoded.uuid,
            newPasswordHash: newPassword
        });

        // 7. 检查更新结果
        if (updateResult.update_user?.affected_rows === 0) {
            console.error(`Password update failed for user: ${decoded.uuid}`);
            throw new Error('User not found or password not updated');
        }

        console.log(`Password successfully reset for user: ${decoded.uuid}`);

        // 8. 返回成功响应
        res.status(200).json({
            message: 'Password updated successfully.',
            username: decoded.username // 可选：返回用户名用于前端显示
        });

    } catch (err) {
        console.error('Error in password reset action:', err);

        // 9. 特定的错误处理（包含类型安全处理）
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ error: 'Invalid or malformed reset token.' });
        }

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ error: 'Reset token has expired. Please request a new reset link.' });
        }

        // 处理其他可能的错误
        const error = err as { message?: string; code?: string };
        if (error.message?.includes('User not found')) {
            return res.status(404).json({ error: 'User account not found.' });
        }

        // 默认错误响应
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

export default router;
