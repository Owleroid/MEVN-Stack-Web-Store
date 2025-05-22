import nodemailer from "nodemailer";
import emailService from "../config/email.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: emailService.email.host,
    port: emailService.email.port,
    secure: emailService.email.secure,
    auth: {
      user: emailService.email.user,
      pass: emailService.email.pass,
    },
  });

  await transporter.sendMail({
    from: emailService.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};
