import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
} from "../controller/booking.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import { validate } from "../../../middlewares/validate";
import {
  cancelBookingSchema,
  createBookingSchema,
  getMyBookingsSchema,
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

router.get(
  "/me",
  authMiddleware,
  validate({
    query: getMyBookingsSchema,
  }),
  getMyBookings,
);

export default router;
