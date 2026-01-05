const { getPrismaClient } = require("../../utils/prisma-client");
const bcrypt = require("bcrypt");

const getUserProfile = async (userId) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    return user;
  } catch (error) {
    throw new Error("Error fetching user profile");
  }
};

const updateUserProfile = async (userId, data) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
      },
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
    return user;
  } catch (error) {
    throw new Error("Error updating user profile");
  }
};

const deleteUserAccount = async (userId) => {
  const prisma = getPrismaClient();
  try {
    // Delete subscriptions, tips, reviews first (cascade should handle this)
    await prisma.user.delete({
      where: { id: userId },
    });
    return { message: "User account deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user account");
  }
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  changePassword,
};
