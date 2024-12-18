"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordEmail = exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = require("../configs");
// transporter for email
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: configs_1.config.user_name,
        pass: configs_1.config.password,
    },
});
// Generic function to send email
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw error;
    }
});
exports.sendEmail = sendEmail;
// reset password Email Template
const resetPasswordEmail = (email, URL, name) => {
    const mailOptions = {
        from: `"Glamora" <${configs_1.config.user_name}>`,
        to: email,
        subject: 'Password Reset Request from Glamora',
        text: `
        Dear ${name},
  
        We received a request to reset the password for your Auto Ride account. To complete the process, please click on the link below.
  
        ${URL}
  
        If you did not request a password reset, please disregard this email. Your password will remain unchanged.
  
        For your security, please do not share this link with anyone.
  
        Best regards,
        Glamora Team
              `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <p>Dear ${name},</p>
                  <p>We received a request to reset the password for your Auto Ride account. To complete the process, please click on the link below:</p>
                  <p> <a href="${URL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #1a73e8; text-decoration: none; border-radius: 5px;">
                  Reset your password
                  </a></p>
                  <p>If you did not request a password reset, please disregard this email. Your password will remain unchanged.</p>
                  <p>For your security, please do not share this link with anyone.</p>
                  <p style="font-size: 0.9em; color: #777;">
                      Best regards,<br>
                      Glamora Team
                  </p>
              </div>
              `
    };
    (0, exports.sendEmail)(mailOptions);
};
exports.resetPasswordEmail = resetPasswordEmail;
