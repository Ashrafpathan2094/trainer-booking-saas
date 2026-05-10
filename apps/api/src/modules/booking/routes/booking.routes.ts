import { Router } from "express";
import { cancelBooking, createBooking } from "../controller/booking.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import { validate } from "../../../middlewares/validate";
import {
  cancelBookingSchema,
  createBookingSchema,
} from "../dto/booking.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("customer"),
  validate({ body: createBookingSchema }),
  createBooking,
);

router.patch(
  "/cancel",
  authMiddleware,
  validate({
    body: cancelBookingSchema,
  }),
  cancelBooking,
);

export default router;
