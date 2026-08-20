import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import authenticate from "./authenticate";
import { sdk as graphql } from "./index";

const router = express.Router();

const baseDir = process.env.FILE_DIR || path.resolve(process.cwd(), "upload");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isSafeFilename = (filename: string) =>
  filename.length > 0 &&
  filename.trim().length > 0 &&
  filename !== "." &&
  filename !== ".." &&
  filename === path.basename(filename) &&
  filename === path.win32.basename(filename) &&
  !filename.includes("\0");

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
  const { room, filename } = req.body ?? {};
  if (typeof room !== "string" || typeof filename !== "string") {
    return res.status(422).send("422 Unprocessable Entity: Missing room or filename");
  }
  if (!UUID_PATTERN.test(room)) {
    return res.status(400).send("400 Bad Request: Invalid room UUID");
  }
  if (!isSafeFilename(filename)) {
    return res.status(400).send("400 Bad Request: Invalid filename");
  }

  try {
    const joinedRooms = await graphql.getJoinedRooms({
      user_uuid: res.locals.userUuid as string,
    });
    const isMember = joinedRooms.user_room.some(
      (userRoom) => userRoom.room.uuid === room,
    );
    if (!isMember) {
      return res.status(403).send("403 Forbidden: User is not a member of this room");
    }

    const roomDir = path.resolve(baseDir, room);
    const filePath = path.resolve(roomDir, filename);
    if (!filePath.startsWith(`${roomDir}${path.sep}`)) {
      return res.status(400).send("400 Bad Request: Invalid filename");
    }

    const stat = await fs.promises.lstat(filePath);
    if (!stat.isFile()) {
      return res.status(400).send("400 Bad Request: Target is not a regular file");
    }
    await fs.promises.unlink(filePath);
    return res.status(200).send("File deleted successfully");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return res.status(404).send("404 Not Found: File does not exist");
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
