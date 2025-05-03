export const dynamic = 'force-dynamic';
import nodemailer from 'nodemailer';
import { connectToDB } from '@mongodb';
import User from "@models/User";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "bebopa37931@gmail.com",
    pass: "mnpg yuib avjp cwhw",
  },
});

export const POST = async (req) => {
  try {
    await connectToDB();
    const { subject, html, attachments,email } = await req.json();

    const allUsers = ['minhhieudev31@gmail.com', ...email]
    console.log('Email:',allUsers)

    const mailOptions = {
      from: "TRƯỜNG ĐẠI HỌC PHÚ YÊN",
      to: allUsers.join(', '),
      subject: subject || 'Default Subject',
      html: html || '<p>Default Email Body</p>',
      attachments: attachments,
    };


    try {
      await transporter.sendMail(mailOptions);
      return new Response('Emails sent successfully', { status: 200 });
    } catch (error) {
      console.error('Failed to send emails:', error);
      return new Response(`Failed to send emails: ${error.message}`, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
