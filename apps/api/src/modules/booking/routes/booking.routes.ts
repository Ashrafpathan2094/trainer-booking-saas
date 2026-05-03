import { Router } from "express";
import { createBooking } from "../controller/booking.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import { validate } from "../../../middlewares/validate";
import { createBookingSchema } from "../dto/booking.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("customer"),
  validate({ body: createBookingSchema }),
  createBooking,
);

export default router;
