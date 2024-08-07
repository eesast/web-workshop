import express from "express";

const router = express.Router();

router.post("/upload/:room", (req, res) => {
  const room = req.params.room;
  const file = req.body.file;
  if (!file) {
    // return res.status(422).send("422 Unprocessable Entity: Missing file");
  }
  return res.send(`You are posting to /file/upload/${room}`);
});

router.get("/list", (req, res) => {
  const room = req.query.room;
  if (!room) {
    return res.status(422).send("422 Unprocessable Entity: Missing room");
  }
  return res.send(`You are getting /file/list?room=${room}`);
});

router.get("/download", (req, res) => {
  const room = req.query.room;
  const filename = req.query.filename;
  if (!room || !filename) {
    return res.status(422).send("422 Unprocessable Entity: Missing room or filename");
  }
  return res.send(`You are getting /file/download?room=${room}&filename=${filename}`);
});

export default router;
