"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const authenticate_1 = __importDefault(require("./authenticate"));
const router = express_1.default.Router();
const baseDir = process.env.FILE_DIR || path_1.default.resolve(process.cwd(), "upload");
const limits = {
    parts: 2, // 1 file and 0 fields
    fileSize: 10 * 1024 * 1024, // 10 MB
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            const room = req.params.room;
            const dir = path_1.default.resolve(baseDir, room);
            fs_1.default.mkdirSync(dir, { recursive: true });
            return cb(null, dir);
        }
        catch (err) {
            return cb(err, "");
        }
    },
    filename: (req, file, cb) => {
        return cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage, limits });
router.post("/upload/:room", authenticate_1.default, upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(422).send("422 Unprocessable Entity: Missing file");
    }
    return res.send("File uploaded successfully");
});
router.get("/list", authenticate_1.default, (req, res) => {
    const room = req.query.room;
    if (!room) {
        return res.status(422).send("422 Unprocessable Entity: Missing room");
    }
    const dir = path_1.default.resolve(baseDir, room);
    try {
        let fileList = [];
        if (fs_1.default.existsSync(dir)) {
            fileList = fs_1.default.readdirSync(dir);
        }
        return res.json({ fileList });
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});
router.get("/download", authenticate_1.default, (req, res) => {
    const room = req.query.room;
    const filename = req.query.filename;
    if (!room || !filename) {
        return res.status(422).send("422 Unprocessable Entity: Missing room or filename");
    }
    const dir = path_1.default.resolve(baseDir, room, filename);
    try {
        if (fs_1.default.existsSync(dir)) {
            return res.download(dir);
        }
        else {
            return res.status(404).send("404 Not Found: File does not exist");
        }
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});
exports.default = router;
//# sourceMappingURL=file.js.map