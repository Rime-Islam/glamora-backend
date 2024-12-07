import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../configs';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string
}

// transporter for email
export const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
    auth: {
        user: config.user_name as string,
        pass: config.password as string,
    },
});

// Generic function to send email
export const sendEmail = async (mailOptions: EmailOptions) => {
    try {
     await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};