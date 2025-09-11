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

app.listen(port, () => {
  console.log(`Server running at ${address}:${port}/`);
});
