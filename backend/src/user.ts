import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import { graphqlClient } from "./index";

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

// 删除用户接口 (痕迹抹除)

router.post("/delete", async (req, res) => {
  // 获取参数并校验
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(422).send("422 Unprocessable Entity: Missing user uuid");
  }

  // 执行 GraphQL 删除操作
  try {
    const mutation = `
      mutation deleteUser($uuid: uuid!) {
        delete_user(where: {uuid: {_eq: $uuid}}) {
          affected_rows
          returning {
            uuid
            username
          }
        }
      }
    `;

    // 调用 graphqlClient.request 发送请求
    const result = await graphqlClient.request<{
      delete_user: {
        affected_rows: number;
        returning: { uuid: string; username: string }[];
      };
    }>(mutation, { uuid });

    // 处理结果
    // affected_rows 表示数据库中被影响（删除）的行数
    if (result.delete_user.affected_rows === 0) {
      // 如果删除了 0 行，说明 uuid 不存在
      return res.status(404).send("404 Not Found: User does not exist");
    }

    // 删除成功，返回被删除的用户信息
    const deletedUser = result.delete_user.returning[0];
    return res.status(200).json({
      message: "User deleted successfully",
      deletedUser: deletedUser,
    });

  } catch (err) {
    // 异常捕获
    console.error(err);
    return res.status(500).send("500 Internal Server Error");
  }
});
export default router;
