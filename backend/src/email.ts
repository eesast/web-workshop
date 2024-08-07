import express from "express";

const router = express.Router();

router.post("/contact-us", (req, res) => {
  const { email, name, message } = req.body;
  if (!email || !name || !message) {
    return res.status(422).send("422 Unprocessable Entity: Missing email, name, or message");
  }
  return res.send("You are posting to /email/contact-us");
});

export default router;
