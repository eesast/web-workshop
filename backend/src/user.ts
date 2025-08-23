import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";

// 新增引入库 用来验证用户名是一个有效的邮箱地址
import { validateEmail, hasInvalidDomain } from './utils/validation';

// 新增引入库 用来生成一个JWT token以及验证之
import {generateResetToken, verifyResetToken} from './utils/jwt_token_utils';

// 新增引入库 用来发送邮件
import { sendEmail } from './email'

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

// 新增通过邮箱重置密码的功能
// 对于目前的版本，我们仅仅考虑用户名是一个有效的邮箱名的情况

// 路由1 发送一封含有重置密码链接的邮件到用户名所在的邮箱地址，链接中需要包括一个使用 JWT 将用户信息签名的 token（来识别和验证身份）
// 注意 由于目前只实现其后端功能 因此上述“链接”以resetToken进行替代
router.post("/change-password/request", async (req, res) => {
  try {
    // 检验用户名是否为空
    const { username } = req.body;
    if (!username) {
      return res.status(422).send("422 Unprocessable Entity: Missing username");
    }

    // 检验用户名是否（在数据库中）存在
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];

    // 检查邮箱格式是否正确
    const emailValidation = validateEmail(username);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // 检查邮箱地址是否包含不合法域名
    if (hasInvalidDomain(username)) {
      return res.status(400).json({ error: '邮箱域名不合法' });
    }

    console.log("Finish the validation of username as a valid e-mail address.")


    // 生成 JWT token，包含用户名、密码
    const resetToken = generateResetToken({user_id:`${user.uuid}`, password:`${user.password}`});

    // 发送带有 resetToken 的邮件，帮助你重置密码
    try {
      const result = await sendEmail(
        `${username}`,
        "Password reset token for you",
        `Hello, ${username}! Your reset token is as follows:\n\n${resetToken}` +
        "\n\nPlease POST /user/change-password/action for password reset, with request body {token: string, newPassword: string}. " +
        "The length of newPassword must be greater than 8." +
        "\n\nNote that the token will expire in 1 hour!",
      );
      if (result.accepted.length > 0) {
        console.log("Message sent successfully");
      } else {
        throw new Error("Failed to send message for unknown reason");
      }
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    return res.status(200).json({resetToken});

  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});



// 路由2 验证 token 的真伪，并根据 token 中的用户信息在数据库中修改密码
router.post("/change-password/action", async (req, res) => {
  try {
    // 检验用户名是否为空
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(422).send("422 Unprocessable Entity: Missing token or newPassword.");
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'The length of newPassword must be greater than 8' });
    }

    // 验证token
    const decoded = verifyResetToken(token);

    // 修改数据库中的密码
    // 注意 database/graphql 目录中的 user.graphql 中的修改
    try {
      const result = await graphql.UpdateUserPassword(
        {
          userID: decoded.userID,
          newPassword: newPassword
        }
      );

      // 如果返回了uuid信息，则说明查询并修改成功
      if (result.update_user_by_pk?.uuid) {
        res.status(200).json({ message: 'Password reset successfully!' });
      } else {
        res.status(400).json({ error: 'Error: user does not exist or password update fails.' });
      }
    } catch (graphqlError) {
      console.error('GraphQL Error:', graphqlError);
      res.status(500).json({ error: 'Database update fails.' });
    }

    // return res.status(200).json({decoded});

  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});


export default router;
