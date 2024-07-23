import nodemailer, { SentMessageInfo } from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "distributedcafe@gmail.com",
    pass: "naly yrdb rrix cmse",
  },
});

export async function sendNotifyMail(customerContact: string): Promise<SentMessageInfo>{

    const mailOptions = {
        from: "distributedcafe@gmail.com",
        to: customerContact,
        subject: "Distributed Cafe Order Ready",
        text: "Dear customer, your order is ready",
      };

    await transporter.sendMail(mailOptions)

}