import Joi from "joi";

export const createBookingSchema = Joi.object({
  slotId: Joi.string().uuid().required(),
});

export const cancelBookingSchema = Joi.object({
  bookingId: Joi.string().uuid().required(),
});
