import Joi from "joi";

export const createBookingSchema = Joi.object({
  slotId: Joi.string().uuid().required(),
});
