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

//databaseHW:2.3.2
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("未处理的错误:", err);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "AUTHENTICATION_ERROR",
      message: "无效的令牌",
      code: "INVALID_TOKEN"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "AUTHENTICATION_ERROR",
      message: "令牌已过期",
      code: "TOKEN_EXPIRED"
    });
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "服务器内部错误",
    code: "UNHANDLED_ERROR"
  });
});

app.listen(port, () => {
  console.log(`Server running at ${address}:${port}/`);
});
