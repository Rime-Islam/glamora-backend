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

// reset password Email Template
export const resetPasswordEmail = (email: string, URL: string, name: string) => {
    const mailOptions = {
        from: `"Glamora" <${config.user_name}>`,
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
    sendEmail(mailOptions);
};