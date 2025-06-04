import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const emailTransport = createTransport(new SMTPTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    }
}))