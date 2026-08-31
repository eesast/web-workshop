import express from "express";
import jwt from "jsonwebtoken";
import { sdk as graphql } from "./index";
import authenticate from "./authenticate";

interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

const router = express.Router();

// 从 Authorization 请求头解析出用户 uuid
const getUuidFromHeader = (req: express.Request): string | null => {
  const authHeader = req.get("Authorization");
  if (!authHeader) return null;
  try {
    const decoded = jwt.verify(
      authHeader.substring(7),
      process.env.JWT_SECRET!
    ) as userJWTPayload;
    return decoded.uuid ?? null;
  } catch {
    return null;
  }
};

// GET /note?room=<room_uuid>：读取当前用户在该会议下的便签（不存在则返回空串）
router.get("/", authenticate, async (req, res) => {
  const user_uuid = getUuidFromHeader(req);
  if (!user_uuid) {
    return res.status(401).send("401 Unauthorized: Token expired or invalid");
  }
  const room_uuid = req.query.room as string | undefined;
  if (!room_uuid) {
    return res.status(422).send("422 Unprocessable Entity: Missing room");
  }
  try {
    const result = await graphql.getNote({ user_uuid, room_uuid });
    const note = result.note[0];
    return res.status(200).json({
      content: note?.content ?? "",
      updated_at: note?.updated_at ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

// POST /note：保存（upsert）当前用户在该会议下的便签，每用户每会议仅一份
router.post("/", authenticate, async (req, res) => {
  const user_uuid = getUuidFromHeader(req);
  if (!user_uuid) {
    return res.status(401).send("401 Unauthorized: Token expired or invalid");
  }
  const { room, content } = req.body ?? {};
  if (!room || typeof content !== "string") {
    return res
      .status(422)
      .send("422 Unprocessable Entity: Missing room or content");
  }
  try {
    const result = await graphql.upsertNote({ user_uuid, room_uuid: room, content });
    return res.status(200).json({
      content: result.insert_note_one?.content ?? "",
      updated_at: result.insert_note_one?.updated_at ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
