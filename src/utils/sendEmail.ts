import nodemailer from "nodemailer";
import { envVars } from "../app/config/env";
import AppError from "../app/errorHelpers/AppError";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  secure: true,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST,
});

interface SendMailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendMailOptions) => {
  try {
    const templetpath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = (await ejs.renderFile(templetpath, templateData)) as string;
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info?.messageId}`);
  } catch (error) {
    console.log("error", error);
    throw new AppError("Email error", 400);
  }
};
