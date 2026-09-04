import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";

// 你的 Admin Secret（直接硬编码）
const ADMIN_SECRET = "ZLq19G1Nk1xASM7ugBF15OoPFE5AL1TNII8yDUfEL2pBnlZUXgkLhDuoXXEGgacX";

// 1. 创建 HTTP Link
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HASURA_HTTPLINK!,
});

// 2. 创建自定义 Link：强制添加 Admin Secret 和 Authorization
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  // 设置请求头
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-hasura-admin-secret": ADMIN_SECRET,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }));
  return forward(operation);
});

// 3. 组合：先执行 authLink，再执行 httpLink
const link = authLink.concat(httpLink);

// 4. 导出 Client
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});