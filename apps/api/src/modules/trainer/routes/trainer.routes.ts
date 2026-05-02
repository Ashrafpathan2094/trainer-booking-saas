import { Router } from "express";
import { becomeTrainer } from "../controller/trainer.controller";
import { validate } from "../../../middlewares/validate";
import { becomeTrainerSchema } from "../dto/trainer.schema";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/become",
  authMiddleware,
  validate({ body: becomeTrainerSchema }),
  becomeTrainer,
);

export default router;
