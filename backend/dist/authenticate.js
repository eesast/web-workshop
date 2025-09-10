"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).send("401 Unauthorized: Missing Token");
    }
    const token = authHeader.substring(7);
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err || !decoded) {
            return res.status(401).send("401 Unauthorized: Token expired or invalid");
        }
        return next();
    });
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map