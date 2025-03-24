import { emailTransport } from "@/config/mailer";


export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const info = await emailTransport.sendMail({
            from: process.env.EMAIL_FROM, // Remitente
            to, // Destinatario
            subject, // Asunto del correo
            html, // Contenido en HTML
        });

        return { success: true, message: info.messageId };
    } catch (error) {
        return { success: false, error };
    }
}
