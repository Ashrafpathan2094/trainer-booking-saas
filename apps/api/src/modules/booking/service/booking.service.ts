import { prisma } from "../../../config/prisma";

export const createBookingService = async (userId: string, slotId: string) => {
  return await prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({
      where: { id: slotId },
      include: {
        trainer: true,
      },
    });
    console.log("🚀 ~ createBookingService ~ slot:", slot);

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

    const existingBooking = await tx.booking.findFirst({
      where: {
        slotId,
        status: {
          in: ["confirmed", "pending"],
        },
      },
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

export const cancelBookingService = async (
  userId: string,
  role: string,
  bookingId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        slot: {
          include: {
            trainer: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }

    if (booking.status === "completed") {
      throw new Error("Completed booking cannot be cancelled");
    }

    if (booking.slot.startTime < new Date()) {
      throw new Error("Past bookings cannot be cancelled");
    }

    const isCustomerOwner = booking.customerId === userId;

    const isTrainerOwner = booking.slot.trainer.userId === userId;

    const isAdmin = role === "admin";

    if (!isCustomerOwner && !isTrainerOwner && !isAdmin) {
      throw new Error("Unauthorized");
    }

    if (isCustomerOwner) {
      const hoursLeft =
        (booking.slot.startTime.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursLeft < 24) {
        throw new Error("Bookings cannot be cancelled within 24 hours");
      }
    }

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });

    await tx.slot.update({
      where: { id: booking.slotId },
      data: {
        status: "available",
      },
    });

    return updatedBooking;
  });
};

export const getMyBookingsService = async (userId: string, query: any) => {
  const type = query.type || "upcoming";

  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  const now = new Date();

  const where: any = {
    customerId: userId,
  };

  // ✅ UPCOMING
  if (type === "upcoming") {
    where.status = {
      in: ["pending", "confirmed"],
    };

    where.slot = {
      startTime: {
        gte: now,
      },
    };
  }

  // ✅ PAST
  if (type === "past") {
    where.OR = [
      {
        status: {
          in: ["completed", "no_show"],
        },
      },
      {
        slot: {
          startTime: {
            lt: now,
          },
        },

        status: {
          not: "cancelled",
        },
      },
    ];
  }

  // ✅ CANCELLED
  if (type === "cancelled") {
    where.status = "cancelled";
  }

  // ✅ TOTAL COUNT FIRST
  const total = await prisma.booking.count({
    where,
  });

  const totalPages = Math.ceil(total / limit) || 1;

  // ✅ PAGE OUT OF RANGE
  if (page > totalPages) {
    return {
      data: [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  // ✅ FETCH BOOKINGS
  const bookings = await prisma.booking.findMany({
    where,

    include: {
      slot: {
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },

      payment: true,
      review: true,
    },

    orderBy: {
      slot: {
        startTime: type === "upcoming" ? "asc" : "desc",
      },
    },

    skip,
    take: limit,
  });

  return {
    data: bookings,

    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
