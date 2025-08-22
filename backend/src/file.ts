import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
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

export default router;
