import { Router } from "express";
import {
  logout,
  refreshToken,
  requestOtp,
  verifyOtp,
} from "../controller/auth.controller";
import { validate } from "../../../middlewares/validate";
import {
  refreshTokenSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../dto/auth.schema";

const router = Router();

router.post("/request-otp", validate({ body: requestOtpSchema }), requestOtp);

router.post("/verify-otp", validate({ body: verifyOtpSchema }), verifyOtp);

router.post("/refresh", validate({ body: refreshTokenSchema }), refreshToken);

router.post("/logout", validate({ body: refreshTokenSchema }), logout);

export default router;
