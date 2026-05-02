import { prisma } from "../../../config/prisma";

export const becomeTrainerService = async (userId: string, data: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { trainerProfile: true },
  });

  if (!user) throw new Error("User not found");

  if (user.role === "trainer") {
    throw new Error("User is already a trainer");
  }

  if (user.trainerProfile) {
    throw new Error("Trainer profile already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    const profile = await tx.trainerProfile.create({
      data: {
        userId,
        bio: data.bio,
        specialties: data.specialties,
        pricePerSession: data.pricePerSession,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { role: "trainer" },
    });

    return profile;
  });

  return result;
};
