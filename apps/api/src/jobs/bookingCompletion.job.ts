import cron from "node-cron";
import { prisma } from "../config/prisma";

export const bookingCompletionJob = cron.schedule("*/15 * * * *", async () => {
  try {
    console.log("Running booking completion job...");

    const completionBufferHours = 2;

    const completionTime = new Date(
      Date.now() - completionBufferHours * 60 * 60 * 1000,
    );

    const result = await prisma.booking.updateMany({
      where: {
        status: "confirmed",

        slot: {
          endTime: {
            lte: completionTime,
          },
        },
      },

      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    console.log(`Completed bookings updated: ${result.count}`);
  } catch (error) {
    console.error("Booking completion job failed:", error);
  }
});
