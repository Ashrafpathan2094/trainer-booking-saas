import { Response } from "express";
import {
  cancelBookingService,
  createBookingService,
} from "../service/booking.service";

export const createBooking = async (req: any, res: Response) => {
  try {
    const { slotId } = req.body;

    const booking = await createBookingService(req.user.userId, slotId);

    res.json({
      message: "Booking successful",
      booking,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await cancelBookingService(
      req.user.userId,
      req.user.role,
      bookingId,
    );

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};
