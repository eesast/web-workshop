import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql";
import userRouter from "./user";
import fileRouter from "./file";
import emailRouter from "./email";

const app = express();
const address = "http://localhost";
const port = process.env.PORT || 8888;

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

// Log all requests to the console
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://your-frontend-domain.com"] 
    : ["http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/email", emailRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send(`
    <h1>趣味会议软件后端服务</h1>
    <p>服务运行正常！</p>
    <p>可用的API端点：</p>
    <ul>
      <li><a href="/user">/user</a> - 用户相关API</li>
      <li><a href="/file">/file</a> - 文件相关API</li>
      <li><a href="/email">/email</a> - 邮件相关API</li>
      <li><a href="/health">/health</a> - 健康检查</li>
    </ul>
  `);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "服务器内部错误" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "接口不存在" });
});

app.listen(port, () => {
  console.log(`服务器运行在 ${address}:${port}/`);
  console.log(`健康检查: ${address}:${port}/health`);
});
