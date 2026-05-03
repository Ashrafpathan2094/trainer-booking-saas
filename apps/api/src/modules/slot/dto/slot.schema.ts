import Joi from "joi";

export const createSlotSchema = Joi.object({
  startTime: Joi.date().required(),
  endTime: Joi.date().greater(Joi.ref("startTime")).required(),
});

export const createBulkSlotSchema = Joi.object({
  startDate: Joi.alternatives(Joi.string(), Joi.date()).required(),
  endDate: Joi.alternatives(Joi.string(), Joi.date()).required(),
  startTime: Joi.string().required(), // "10:00"
  endTime: Joi.string().required(),
  slotDuration: Joi.number().min(15).required(),
});

export const getAvailableSlotsSchema = Joi.object({
  trainerId: Joi.string().uuid().required(),
  startDate: Joi.alternatives(Joi.string(), Joi.date()).required(),
  endDate: Joi.alternatives(Joi.string(), Joi.date()).required(),
});
