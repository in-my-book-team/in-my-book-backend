import nodemailer from 'nodemailer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Activating account on ' + process.env.API_URL,
      text: '',
      html: `
        <div>
          <h1>To activate follow the link</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
