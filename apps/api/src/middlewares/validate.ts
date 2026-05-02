import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

interface ValidationSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) errors.push(...error.details.map((d) => d.message));
      else req.body = value;
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params);
      if (error) errors.push(...error.details.map((d) => d.message));
      else req.params = value;
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query);
      if (error) errors.push(...error.details.map((d) => d.message));
      else req.query = value;
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};
