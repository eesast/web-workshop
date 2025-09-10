import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql";
import userRouter from "./user";
import fileRouter from "./file";
import emailRouter from "./email";

const app = express();
const address = "http://localhost";
const port = 8888;

dotenv.config({
  path: path.resolve(process.cwd(), ".local.env"),
});

const client = new GraphQLClient(
  process.env.HASURA_GRAPHQL_ENDPOINT!,
  {
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    },
  }
);
export const sdk = getSdk(client);

// Log all requests to the console, optional.
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/email", emailRouter);

// 要添加的新接口
app.post("/sendMessage", async (req, res) => {
  // 从 Hasura Action 的请求体中获取参数
  const { user_uuid, room_uuid, content } = req.body.input;

  // 输入验证
  if (!content || content.trim() === "") {
    return res.status(400).json({
      message: "Content cannot be empty",
    });
  }

  // 调用 Hasura GraphQL API 来插入数据
  try {
    const data = await sdk.addMessage({
      user_uuid: user_uuid,
      room_uuid: room_uuid,
      content: content,
    });

    // 返回成功响应
    return res.json({
      uuid: data.insert_message_one?.uuid,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to send message",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at ${address}:${port}/`);
});
