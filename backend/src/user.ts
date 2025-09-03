import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import nodemailer from "nodemailer";
import crypto from "crypto";

interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password} = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];
    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
    if (user.password !== hashedPassword) {
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
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password");
  }
  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length !== 0) {
      return res.status(409).send("409 Conflict: User already exists");
    }
    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
    const mutationResult = await graphql.addUser({ username: username, password: hashedPassword, email: email ?? null });
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
  if (!username) return res.status(400).json({ error: "Missing username" });

  let user;
  try {
    const result = await graphql.getUsersByUsername({ username });
    user = result.user[0];
  } catch {
    return res.status(500).json({ error: "Database error" });
  }
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.email) return res.status(422).json({ error: "User has no email"});
  
  const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "30m" });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `http://localhost:8888/user/change-password/action?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: user.email,
    subject: "密码重置",
    text: `请点击链接重置密码：${resetLink}`,
  });

  res.status(200).json({ message: "Reset email sent" });
});

router.post("/change-password/action", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Missing token or newPassword" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // 修改数据库密码
  try {
    const hashedPassword = crypto.createHash("md5").update(newPassword).digest("hex");
    await graphql.updateUserPassword({ username: payload.username, password: hashedPassword });
    res.status(200).json({ message: "Password updated" });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
