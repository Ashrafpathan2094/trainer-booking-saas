import { Response } from "express";
import {
  createSlotService,
  createBulkSlotsService,
} from "../service/slot.service";
import { getAvailableSlotsService } from "../service/slot.service";

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

export const getAvailableSlots = async (req: any, res: any) => {
  try {
    const { trainerId, startDate, endDate } = req.query;

    if (!trainerId || !startDate || !endDate) {
      return res.status(400).json({
        message: "trainerId, startDate, endDate are required",
      });
    }

    const slots = await getAvailableSlotsService(trainerId, startDate, endDate);

    res.json({
      count: slots.length,
      slots,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to fetch slots",
    });
  }
};
