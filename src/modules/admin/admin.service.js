const { getPrismaClient } = require("../../utils/prisma-client");

const getAllUsers = async (filters = {}) => {
  const prisma = getPrismaClient();
  try {
    const where = {};
    if (filters.role) where.role = filters.role;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

const updateUserRole = async (userId, newRole) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error updating user role");
  }
};

const deactivateUser = async (userId) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error deactivating user");
  }
};

const activateUser = async (userId) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error activating user");
  }
};

const getAllTips = async (filters = {}) => {
  const prisma = getPrismaClient();
  try {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.sport) where.sport = filters.sport;

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
      },
      orderBy: { createdAt: "desc" },
    });

    return tips;
  } catch (error) {
    throw new Error("Error fetching tips");
  }
};

const updateTipStatus = async (tipId, status) => {
  const prisma = getPrismaClient();
  try {
    const tip = await prisma.tip.update({
      where: { id: tipId },
      data: { status },
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
    throw new Error("Error updating tip status");
  }
};

const deleteTip = async (tipId) => {
  const prisma = getPrismaClient();
  try {
    await prisma.tip.delete({ where: { id: tipId } });
    return { message: "Tip deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting tip");
  }
};

const getAdminDashboard = async () => {
  const prisma = getPrismaClient();
  try {
    const totalUsers = await prisma.user.count();
    const totalTips = await prisma.tip.count();
    const totalSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" },
    });
    const totalReviews = await prisma.review.count();

    return {
      totalUsers,
      totalTips,
      activeSubscriptions: totalSubscriptions,
      totalReviews,
    };
  } catch (error) {
    throw new Error("Error fetching dashboard stats");
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  getAllTips,
  updateTipStatus,
  deleteTip,
  getAdminDashboard,
};
