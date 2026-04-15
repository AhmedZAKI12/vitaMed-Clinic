import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitamedclinic085@gmail.com",
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text) => {

  try {

    await transporter.sendMail({
      from: `"VitaMed Clinic" <vitamedclinic085@gmail.com>`,
      to,
      subject,
      text
    });

    console.log("Email sent");

  } catch (error) {

    console.log("Email error:", error);

  }

};