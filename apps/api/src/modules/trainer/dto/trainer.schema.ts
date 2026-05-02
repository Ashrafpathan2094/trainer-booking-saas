import Joi from "joi";

export const becomeTrainerSchema = Joi.object({
  bio: Joi.string().allow("").optional(),
  specialties: Joi.array().items(Joi.string()).min(1).required(),
  pricePerSession: Joi.number().positive().required(),
});
