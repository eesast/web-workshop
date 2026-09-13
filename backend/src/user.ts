import express from "express";
import jwt from "jsonwebtoken";
import { gql } from "graphql-request";
import { client, sdk as graphql } from "./index";

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

router.get("/delete", authenticate, async (req, res) => {
  const authHeader = req.get("Authorization");
  const token = authHeader?.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).send("401 Unauthorized: Missing Token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as userJWTPayload;
    if (!decoded.uuid) {
      return res.status(401).send("401 Unauthorized: Token has no user id");
    }

    const result = await client.request<{
      delete_user: { affected_rows: number };
    }>(gql`
      mutation deleteCurrentUser($uuid: uuid!) {
        delete_user(where: { uuid: { _eq: $uuid } }) {
          affected_rows
        }
      }
    `, { uuid: decoded.uuid });

    if (result.delete_user.affected_rows !== 1) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
