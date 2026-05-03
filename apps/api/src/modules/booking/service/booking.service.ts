import { prisma } from "../../../config/prisma";

export const createBookingService = async (userId: string, slotId: string) => {
  return await prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({
      where: { id: slotId },
      include: {
        trainer: true,
      },
    });

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (slot.trainer.userId === userId) {
      throw new Error("You cannot book your own slot");
    }

    if (slot.status !== "available") {
      throw new Error("Slot is not available");
    }

    if (slot.startTime < new Date()) {
      throw new Error("Cannot book past slots");
    }

    const existingBooking = await tx.booking.findUnique({
      where: { slotId },
    });

    if (existingBooking) {
      throw new Error("Slot already booked");
    }

    const booking = await tx.booking.create({
      data: {
        slotId,
        customerId: userId,
        status: "confirmed",
      },
    });

    await tx.slot.update({
      where: { id: slotId },
      data: {
        status: "booked",
      },
    });

    return booking;
  });
};
