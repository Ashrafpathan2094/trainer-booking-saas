import { prisma } from "../../../config/prisma";

// normalize to avoid precision mismatch
const normalizeDate = (d: Date) => new Date(d.toISOString());

// parse date safely
const parseISODate = (input: string | Date) => {
  if (input instanceof Date) return normalizeDate(input);

  const [y, m, d] = input.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

// parse HH:mm
const parseTimeUTC = (date: Date, time: string) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setUTCHours(h, m, 0, 0);
  return normalizeDate(d);
};

// =======================
// SINGLE SLOT
// =======================
export const createSlotService = async (
  userId: string,
  startTime: Date,
  endTime: Date,
) => {
  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId },
  });

  if (!trainer) throw new Error("Trainer profile not found");

  try {
    return await prisma.slot.create({
      data: {
        trainerId: trainer.id,
        startTime: normalizeDate(startTime),
        endTime: normalizeDate(endTime),
      },
    });
  } catch (err: any) {
    if (err.message.includes("no_overlap_slots")) {
      throw new Error("Slot overlaps with existing slot");
    }
    throw err;
  }
};

// =======================
// BULK SLOT
// =======================
export const createBulkSlotsService = async (userId: string, data: any) => {
  const { startDate, endDate, startTime, endTime, slotDuration } = data;

  if (slotDuration % 15 !== 0) {
    throw new Error("Slot duration must be multiple of 15 minutes");
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId },
  });

  if (!trainer) throw new Error("Trainer profile not found");

  const start = parseISODate(startDate);
  const end = parseISODate(endDate);

  if (end < start) {
    throw new Error("End date cannot be before start date");
  }

  const slots: any[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dayStart = parseTimeUTC(currentDate, startTime);
    const dayEnd = parseTimeUTC(currentDate, endTime);

    let cursor = new Date(dayStart);

    while (cursor < dayEnd) {
      const slotEnd = new Date(cursor.getTime() + slotDuration * 60000);

      if (slotEnd > dayEnd) break;

      slots.push({
        trainerId: trainer.id,
        startTime: normalizeDate(cursor),
        endTime: normalizeDate(slotEnd),
      });

      cursor = slotEnd;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  let createdCount = 0;
  let skippedCount = 0;

  // 🔥 IMPORTANT: insert one-by-one so DB enforces overlap
  for (const slot of slots) {
    try {
      await prisma.slot.create({ data: slot });
      createdCount++;
    } catch (err: any) {
      if (err.message.includes("no_overlap_slots")) {
        skippedCount++;
        continue;
      }
      throw err;
    }
  }

  return {
    createdCount,
    skippedCount,
  };
};
