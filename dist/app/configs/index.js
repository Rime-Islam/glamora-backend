"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.config = {
    port: process.env.PORT,
    saltRounds: process.env.SALTROUNDS,
    jwt_secrate: process.env.JWT_SECRET,
    jwt_secrate_date: process.env.JWT_ACCESS_EXPIRES_IN,
    URL: process.env.FRONTEND_URL,
    BA_URL: process.env.BACKEND_URL,
    user_name: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    payment_url: process.env.PAYMENT_URL,
    payment_varifyurl: process.env.PAYMENT_TRANSACTION,
};
