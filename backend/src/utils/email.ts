import nodemailer from 'nodemailer';
import { config } from '../config/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

let transporter: nodemailer.Transporter;

export function initEmailService() {
  transporter = nodemailer.createTransport({
    host: config.mailtrap.host,
    port: config.mailtrap.port,
    auth: {
      user: config.mailtrap.user,
      pass: config.mailtrap.pass,
    },
  });
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Avoid external SMTP calls in automated tests.
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (!transporter) {
    initEmailService();
  }

  try {
    await transporter.sendMail({
      from: config.mailtrap.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export function generateVerificationEmailHtml(
  verificationLink: string,
  userName: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Підтвердження електронної адреси</title>
      </head>
      <body>
        <h2>Привіт, ${userName}!</h2>
        <p>Дякуємо за реєстрацію в Ресурсному центрі "Бібліотека".</p>
        <p>Для завершення реєстрації, будь ласка, натисніть на посилання нижче:</p>
        <p>
          <a href="${verificationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Підтвердити електронну адресу
          </a>
        </p>
        <p>Або скопіюйте посилання у вашу адресну строку браузера:</p>
        <p>${verificationLink}</p>
        <p>Це посилання дійсне протягом 24 годин.</p>
        <p>З найкращими побажаннями,<br>Команда Ресурсного центру</p>
      </body>
    </html>
  `;
}
