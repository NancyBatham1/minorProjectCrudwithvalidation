import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'rk85783@gmail.com',
        pass: "fipqixyduqqmvfdf",
    },
});

await transporter.verify();
console.log("Server is ready to take our messages");

export const sendEmailToUser = async ({to, subject, template, emailValues, attachment} ) => {
    try {
        const htmlContent = await ejs.renderFile(path.join(__dirname, '..', 'views/emails', template), emailValues);
        
        let emailOptions = {
            from: '"Example Team" <rk85783@gmail.com>', // sender address
            to: to,
            bcc: "nancy0111@mailinator.com", // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        }; 

        if (attachment) { emailOptions.attachment = attachment }
        const info = await transporter.sendMail(emailOptions);

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
}
