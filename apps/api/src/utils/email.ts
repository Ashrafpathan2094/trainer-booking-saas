import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

// Nodemailer transporter (dev)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    // DEV → Gmail
    if (process.env.NODE_ENV === "development") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: `
          <h2>Your OTP Code</h2>
          <p>Your OTP is: <b>${otp}</b></p>
        `,
      });

      console.log("📧 OTP sent via Gmail (dev)");
    }

    // PROD → Resend
    else {
      const response = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your OTP Code",
        html: `
          <h2>Your OTP Code</h2>
          <p>Your OTP is: <b>${otp}</b></p>
        `,
      });

      console.log("✅ RESEND SUCCESS:", response);
    }
  } catch (error: any) {
    console.error("❌ EMAIL ERROR:", error?.message || error);
    throw new Error("Failed to send OTP email");
  }
};
