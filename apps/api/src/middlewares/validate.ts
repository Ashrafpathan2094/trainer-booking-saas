import { Request, Response, NextFunction } from "express";

export const validate =
  (schemas: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.message });
        }
        req.body = value;
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query);
        if (error) {
          return res.status(400).json({ message: error.message });
        }

        // 🔥 FIX: don't overwrite, mutate instead
        Object.assign(req.query, value);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
