import { Response } from "express";
import {
  createSlotService,
  createBulkSlotsService,
} from "../service/slot.service";

export const createSlot = async (req: any, res: Response) => {
  try {
    const { startTime, endTime } = req.body;

    const slot = await createSlotService(
      req.user.userId,
      new Date(startTime),
      new Date(endTime),
    );

    res.json(slot);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createBulkSlots = async (req: any, res: Response) => {
  try {
    const result = await createBulkSlotsService(req.user.userId, req.body);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
