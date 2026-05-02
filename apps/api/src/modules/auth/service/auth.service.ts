import { prisma } from "../../../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../../../utils/email";
import crypto from "crypto";

const generateOtp = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
export const requestOtpService = async (email: string) => {
  if (!email) throw new Error("Email is required");

  const otp = await generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await prisma.otpCode.create({
    data: {
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
  await sendOtpEmail(email, otp);
  console.log(`OTP for ${email}: ${otp}`);

  return { message: "OTP sent" };
};

export const verifyOtpService = async (email: string, otp: string) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      isUsed: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("OTP expired or not found");
  }

  const isValid = await bcrypt.compare(otp, record.otp);

  if (!isValid) {
    throw new Error("Invalid OTP");
  }

  await prisma.otpCode.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: "customer",
        isVerified: true,
      },
    });
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" },
  );

  const refreshToken = generateRefreshToken();

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: { gte: new Date() },
    },
  });

  if (!session) throw new Error("Invalid refresh token");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) throw new Error("User not found");

  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" },
  );

  return { accessToken: newAccessToken };
};

export const logoutService = async (refreshToken: string) => {
  await prisma.session.deleteMany({
    where: { refreshToken },
  });

  return { message: "Logged out" };
};
