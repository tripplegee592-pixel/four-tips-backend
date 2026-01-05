const { getPrismaClient } = require("../../utils/prisma-client");

const subscribeToTipster = async (userId, tipsterId, plan = "FREE") => {
  const prisma = getPrismaClient();
  try {
    // Check if user is trying to subscribe to themselves
    if (userId === tipsterId) {
      throw new Error("Cannot subscribe to yourself");
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_tipsterId: {
          userId,
          tipsterId,
        },
      },
    });

    if (existingSubscription) {
      throw new Error("Already subscribed to this tipster");
    }

    // Check if tipster exists
    const tipster = await prisma.user.findUnique({ where: { id: tipsterId } });
    if (!tipster) throw new Error("Tipster not found");

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        tipsterId,
        plan,
        status: "ACTIVE",
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

    return subscription;
  } catch (error) {
    throw error;
  }
};

const unsubscribeFromTipster = async (userId, tipsterId) => {
  const prisma = getPrismaClient();
  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_tipsterId: {
          userId,
          tipsterId,
        },
      },
    });

    if (!subscription) throw new Error("Subscription not found");

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELLED" },
    });

    return { message: "Unsubscribed successfully" };
  } catch (error) {
    throw error;
  }
};

const getUserSubscriptions = async (userId) => {
  const prisma = getPrismaClient();
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        tipster: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return subscriptions;
  } catch (error) {
    throw new Error("Error fetching subscriptions");
  }
};

const getTipsterSubscribers = async (tipsterId) => {
  const prisma = getPrismaClient();
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { tipsterId },
      include: {
        subscriber: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return subscriptions;
  } catch (error) {
    throw new Error("Error fetching subscribers");
  }
};

const getSubscriptionStatus = async (userId, tipsterId) => {
  const prisma = getPrismaClient();
  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_tipsterId: {
          userId,
          tipsterId,
        },
      },
    });

    return subscription || null;
  } catch (error) {
    throw new Error("Error checking subscription status");
  }
};

module.exports = {
  subscribeToTipster,
  unsubscribeFromTipster,
  getUserSubscriptions,
  getTipsterSubscribers,
  getSubscriptionStatus,
};
