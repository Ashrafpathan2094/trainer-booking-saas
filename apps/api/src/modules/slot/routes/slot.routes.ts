import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import {
  createBulkSlots,
  createSlot,
  getAvailableSlots,
} from "../controller/slot.controller";
import { validate } from "../../../middlewares/validate";
import { getAvailableSlotsSchema } from "../dto/slot.schema";
const router = Router();

router.post("/create", authMiddleware, requireRole("trainer"), createSlot);
router.post("/bulk", authMiddleware, requireRole("trainer"), createBulkSlots);
router.get(
  "/available",
  validate({ query: getAvailableSlotsSchema }),
  getAvailableSlots,
);

export default router;
