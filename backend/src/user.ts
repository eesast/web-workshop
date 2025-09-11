import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import { sendEmail } from "./email";

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

export default router;

router.post("/change-password/request", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(422).send("Missing username");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("User not found");
    }
    const user = queryResult.user[0];
    const token = jwt.sign(
      { uuid: user.uuid },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" });
    const link = `http://localhost:8888/user/change-password/action?token=${token}`;
    await sendEmail(username, "Password Reset Request", `Click this link: ${link}`);
    return res.status(200).send("Reset email sent");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(422).send("Missing token or newPassword");
  }
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const uuid = payload.uuid;
    const result = await graphql.updateUserPassword({
      uuid,
      password: newPassword,
    });
    if (result.update_user?.affected_rows === 0) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send("Password updated successfully");
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});
