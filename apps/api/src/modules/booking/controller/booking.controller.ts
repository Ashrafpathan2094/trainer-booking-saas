import { Response } from "express";
import { createBookingService } from "../service/booking.service";

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
