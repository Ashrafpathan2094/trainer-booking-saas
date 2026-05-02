import { Request, Response } from "express";
import { becomeTrainerService } from "../service/trainer.service";

export const becomeTrainer = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const result = await becomeTrainerService(userId, req.body);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
