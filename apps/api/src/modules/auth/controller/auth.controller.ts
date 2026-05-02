import { Request, Response } from "express";
import {
  logoutService,
  refreshTokenService,
  requestOtpService,
  verifyOtpService,
} from "../service/auth.service";

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await requestOtpService(email);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService(refreshToken);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const result = await logoutService(refreshToken);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
