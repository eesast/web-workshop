import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { gql } from "graphql-request";
import { client } from "./index";
import authenticate from "./authenticate";

const router = express.Router();

const baseDir = process.env.FILE_DIR || path.resolve(process.cwd(), "upload");

const limits = {
  parts: 2, // 1 file and 0 fields
  fileSize: 10 * 1024 * 1024, // 10 MB
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const room = req.params.room;
      const dir = path.resolve(baseDir, room);
      fs.mkdirSync(dir, { recursive: true });
      return cb(null, dir);
    } catch (err) {
      return cb(err as Error, "");
    }
  },
  filename: (req, file, cb) => {
    return cb(null, file.originalname);
  }
})
const upload = multer({ storage, limits });

router.post("/upload/:room", authenticate, upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(422).send("422 Unprocessable Entity: Missing file");
  }
  return res.send("File uploaded successfully");
});

router.get("/list", authenticate, (req, res) => {
  const room = req.query.room;
  if (!room) {
    return res.status(422).send("422 Unprocessable Entity: Missing room");
  }
  const dir = path.resolve(baseDir, room as string);
  try {
    let fileList: string[] = [];
    if (fs.existsSync(dir)) {
      fileList = fs.readdirSync(dir);
    }
    return res.json({ fileList });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.get("/download", authenticate, (req, res) => {
  const room = req.query.room;
  const filename = req.query.filename;
  if (!room || !filename) {
    return res.status(422).send("422 Unprocessable Entity: Missing room or filename");
  }
  const dir = path.resolve(baseDir, room as string, filename as string);
  try {
    if (fs.existsSync(dir)) {
      return res.download(dir);
    } else {
      return res.status(404).send("404 Not Found: File does not exist");
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/delete", authenticate, async (req, res) => {
  const { room, filename } = req.body as { room?: unknown; filename?: unknown };
  if (typeof room !== "string" || typeof filename !== "string" || !room || !filename) {
    return res.status(422).send("422 Unprocessable Entity: Missing room or filename");
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(room)) {
    return res.status(422).send("422 Unprocessable Entity: Invalid room");
  }
  if (path.basename(filename) !== filename || filename.includes("\0")) {
    return res.status(422).send("422 Unprocessable Entity: Invalid filename");
  }

  const authHeader = req.get("Authorization");
  const token = authHeader?.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).send("401 Unauthorized: Missing Token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uuid?: string };
    if (!decoded.uuid) {
      return res.status(401).send("401 Unauthorized: Token has no user id");
    }

    const membership = await client.request<{
      user_room: Array<{ user_uuid: string }>;
    }>(gql`
      query canDeleteFile($user_uuid: uuid!, $room_uuid: uuid!) {
        user_room(where: { user_uuid: { _eq: $user_uuid }, room_uuid: { _eq: $room_uuid } }) {
          user_uuid
        }
      }
    `, { user_uuid: decoded.uuid, room_uuid: room });
    if (membership.user_room.length === 0) {
      return res.status(403).send("403 Forbidden: User is not a member of this room");
    }

    const roomDir = path.resolve(baseDir, room);
    const target = path.resolve(roomDir, filename);
    if (!target.startsWith(roomDir + path.sep)) {
      return res.status(422).send("422 Unprocessable Entity: Invalid filename");
    }
    if (!fs.existsSync(target)) {
      return res.status(404).send("404 Not Found: File does not exist");
    }
    await fs.promises.unlink(target);
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
