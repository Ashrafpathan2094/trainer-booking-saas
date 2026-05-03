import { Router } from "express";
import { createSlot, createBulkSlots } from "../controller/slot.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";

const router = Router();

router.post("/create", authMiddleware, requireRole("trainer"), createSlot);
router.post("/bulk", authMiddleware, requireRole("trainer"), createBulkSlots);

export default router;