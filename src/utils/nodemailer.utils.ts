import nodemailer from 'nodemailer';
import { EmailOptions } from '../types/global.types';



const transporter = nodemailer.createTransport({
    // @ts-expect-error // host type error
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: process.env.SMTP_PORT,
    secure: parseInt(process.env.SMTP_PORT ?? '') === 465 ? true : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendEmail = async ($options: EmailOptions) => {
    try {
        await transporter.sendMail({
            from: `shop-kart <${process.env.SMTP_USER}>`,
            subject: $options.subject,
            to: $options.to,
            html: $options.html
        })
    } catch (error) {
        console.log(error)
    }
    
}