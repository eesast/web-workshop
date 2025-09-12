import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import { GraphQLClient } from "graphql-request";
import { sendEmail } from "./email";
import authenticate from "./authenticate";

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
    return res.status(422).send("422 Unprocessable Entity: Missing username");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length === 0) {
      // Do not reveal whether user exists to avoid user enumeration
      return res.sendStatus(200);
    }
    const user = queryResult.user[0];
    const payload = { uuid: user.uuid, username };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const site = process.env.SITE_URL || `http://localhost:8888`;
    const resetLink = `${site}/user/change-password?action=token&token=${token}`;
    const text = `You (or someone else) requested a password reset. Use the link below to reset your password (valid 1 hour):\n\n${resetLink}`;
    try {
      await sendEmail(username, "Password reset request", text);
      return res.sendStatus(200);
    } catch (err) {
      console.error("Failed to send reset email", err);
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(422).send("422 Unprocessable Entity: Missing token or newPassword");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as any;
    if (!decoded || !decoded.uuid) {
      return res.status(401).send("401 Unauthorized: Invalid token");
    }
    const userUuid = decoded.uuid;
    try {
      const client = new GraphQLClient(process.env.HASURA_GRAPHQL_ENDPOINT!, {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
        },
      });
      const mutation = `mutation updateUserPassword($uuid: uuid!, $password: String!) {\n  update_user_by_pk(pk_columns: {uuid: $uuid}, _set: {password: $password}) { uuid }\n}`;
      await client.request(mutation, { uuid: userUuid, password: newPassword });
      return res.sendStatus(200);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error(err);
    return res.status(401).send("401 Unauthorized: Token expired or invalid");
  }
});

router.get("/delete", authenticate, async (req, res) => {
  // Expect Authorization header handled by authenticate middleware
  const authHeader = req.get("Authorization")!;
  const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as any;
      const userUuid = decoded.uuid;
      try {
        const client = new GraphQLClient(process.env.HASURA_GRAPHQL_ENDPOINT!, {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
          },
        });
        const mutation = `mutation deleteUserByPk($uuid: uuid!) {\n  delete_user_by_pk(uuid: $uuid) { uuid }\n}`;
        await client.request(mutation, { uuid: userUuid });
        return res.sendStatus(200);
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    } catch (err) {
      console.error(err);
      return res.status(401).send("401 Unauthorized: Invalid token");
    }
});

export default router;
