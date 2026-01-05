const { getPrismaClient } = require("../../utils/prisma-client");

const createTip = async (tipData, tipsterId) => {
  const prisma = getPrismaClient();
  try {
    const tip = await prisma.tip.create({
      data: {
        ...tipData,
        tipsterId,
      },
      include: {
        tipster: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return tip;
  } catch (error) {
    throw new Error("Error creating tip");
  }
};

const getTipById = async (tipId) => {
  const prisma = getPrismaClient();
  try {
    const tip = await prisma.tip.findUnique({
      where: { id: tipId },
      include: {
        tipster: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    return tip;
  } catch (error) {
    throw new Error("Error fetching tip");
  }
};

const getAllTips = async (filters = {}) => {
  const prisma = getPrismaClient();
  try {
    const where = {};
    if (filters.sport) where.sport = filters.sport;
    if (filters.tipsterId) where.tipsterId = filters.tipsterId;
    if (filters.status) where.status = filters.status;

    const tips = await prisma.tip.findMany({
      where,
      include: {
        tipster: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return tips;
  } catch (error) {
    throw new Error("Error fetching tips");
  }
};

const updateTip = async (tipId, tipData, tipsterId) => {
  const prisma = getPrismaClient();
  try {
    // Check if user is the tip creator
    const tip = await prisma.tip.findUnique({ where: { id: tipId } });
    if (!tip) throw new Error("Tip not found");
    if (tip.tipsterId !== tipsterId) throw new Error("Unauthorized");

    const updatedTip = await prisma.tip.update({
      where: { id: tipId },
      data: tipData,
      include: {
        tipster: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return updatedTip;
  } catch (error) {
    throw error;
  }
};

const deleteTip = async (tipId, tipsterId) => {
  const prisma = getPrismaClient();
  try {
    const tip = await prisma.tip.findUnique({ where: { id: tipId } });
    if (!tip) throw new Error("Tip not found");
    if (tip.tipsterId !== tipsterId) throw new Error("Unauthorized");

    await prisma.tip.delete({ where: { id: tipId } });
    return { message: "Tip deleted successfully" };
  } catch (error) {
    throw error;
  }
};

const addReview = async (tipId, userId, rating, comment) => {
  const prisma = getPrismaClient();
  try {
    const review = await prisma.review.create({
      data: {
        tipId,
        userId,
        rating: Math.min(5, Math.max(1, rating)), // Clamp between 1-5
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return review;
  } catch (error) {
    throw new Error("Error adding review");
  }
};

module.exports = {
  createTip,
  getTipById,
  getAllTips,
  updateTip,
  deleteTip,
  addReview,
};
