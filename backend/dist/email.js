"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });
    try {
        await transporter.verify();
        return await transporter.sendMail({ from: process.env.EMAIL_ADDRESS, to, subject, text });
    }
    catch (err) {
        throw err;
    }
};
router.post("/contact-us", async (req, res) => {
    const { email, name, message } = req.body;
    if (!email || !name || !message) {
        return res.status(422).send("422 Unprocessable Entity: Missing email, name, or message");
    }
    try {
        const result = await sendEmail(process.env.EMAIL_ADDRESS, "Web Workshop Contact Us Form", `Message from ${name} <${email}>:\n\n${message}`);
        if (result.accepted.length > 0) {
            return res.send("Message sent successfully");
        }
        else {
            throw new Error("Failed to send message for unknown reason");
        }
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});
exports.default = router;
//# sourceMappingURL=email.js.map