"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const graphql_request_1 = require("graphql-request");
const graphql_1 = require("./graphql");
const user_1 = __importDefault(require("./user"));
const file_1 = __importDefault(require("./file"));
const email_1 = __importDefault(require("./email"));
const app = (0, express_1.default)();
const address = "http://localhost";
const port = process.env.PORT || 8888;
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".local.env"),
});
const client = new graphql_request_1.GraphQLClient(process.env.HASURA_GRAPHQL_ENDPOINT, {
    headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
});
exports.sdk = (0, graphql_1.getSdk)(client);
// Log all requests to the console
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:3000"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use("/user", user_1.default);
app.use("/file", file_1.default);
app.use("/email", email_1.default);
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
app.use((err, req, res, next) => {
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
//# sourceMappingURL=index.js.map