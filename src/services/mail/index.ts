import nodemailer from 'nodemailer';
import { mailHTML } from '../../models/mailHTML';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class Mail {
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

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Activating account on ${process.env.API_URL}`,
      text: '',
      html: mailHTML(link),
    });
  }
}

export default Mail;
