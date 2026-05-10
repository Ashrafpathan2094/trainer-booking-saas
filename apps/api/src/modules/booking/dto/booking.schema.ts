import Joi from "joi";

export const createBookingSchema = Joi.object({
  slotId: Joi.string().uuid().required(),
});

export const cancelBookingSchema = Joi.object({
  bookingId: Joi.string().uuid().required(),
});

export const getMyBookingsSchema = Joi.object({
  type: Joi.string()
    .valid("upcoming", "past", "cancelled", "all")
    .default("upcoming"),

  page: Joi.number().min(1).default(1),

  limit: Joi.number().min(1).max(50).default(10),
});

export const getTrainerSessionsSchema = Joi.object({
  type: Joi.string()
    .valid("upcoming", "past", "cancelled", "all")
    .default("upcoming"),

  page: Joi.number().min(1).default(1),

  limit: Joi.number().min(1).max(50).default(10),
});
