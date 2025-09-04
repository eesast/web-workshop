import express from "express";
import nodemailer from "nodemailer";
import { body, validationResult } from 'express-validator';
import { UserInputError } from 'apollo-server-express';

const router = express.Router();

const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_SECURE! === "true",
    auth: {
      user: process.env.EMAIL_ADDRESS!,
      pass: process.env.EMAIL_PASSWORD!,
    },
    tls: { rejectUnauthorized: false },
  });
  try {
    await transporter.verify();
    return await transporter.sendMail({ from: process.env.EMAIL_ADDRESS!, to, subject, text });
  } catch (err) {
    throw err;
  }
}

const validateContactForm = [
  body('email')
    .isEmail().withMessage('请提供有效的电子邮件地址')
    .normalizeEmail(),
  body('name')
    .isLength({ min: 2, max: 50 }).withMessage('姓名长度必须在2-50个字符之间')
    .trim(),
  body('message')
    .isLength({ min: 10, max: 2000 }).withMessage('消息长度必须在10-2000个字符之间')
    .trim()
];

router.post("/contact-us", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        message: err.msg,
        field: err.param
      }))
    });
  }
  const { email, name, message } = req.body;
  if (!email || !name || !message) {
    return res.status(422).send("422 Unprocessable Entity: Missing email, name, or message");
  }
  try {
    const result = await sendEmail(
      process.env.EMAIL_ADDRESS!,
      "Web Workshop Contact Us Form",
      `Message from ${name} <${email}>:\n\n${message}`,
    );
    if (result.accepted.length > 0) {
      return res.send("Message sent successfully");
    } else {
      throw new Error("Failed to send message for unknown reason");
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
