const subscriptionsService = require("./subscriptions.service");

const subscribe = async (req, res) => {
  try {
    const { tipsterId, plan } = req.body;

    if (!tipsterId) {
      return res.status(400).json({ message: "Tipster ID is required" });
    }

    const subscription = await subscriptionsService.subscribeToTipster(
      req.user.userId,
      tipsterId,
      plan || "FREE"
    );

    res.status(201).json({ message: "Subscribed successfully", data: subscription });
  } catch (error) {
    if (error.message.includes("Already subscribed") || error.message.includes("Cannot subscribe")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { tipsterId } = req.body;

    if (!tipsterId) {
      return res.status(400).json({ message: "Tipster ID is required" });
    }

    const result = await subscriptionsService.unsubscribeFromTipster(req.user.userId, tipsterId);
    res.json(result);
  } catch (error) {
    if (error.message.includes("Subscription not found")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionsService.getUserSubscriptions(req.user.userId);
    res.json({ data: subscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubscribers = async (req, res) => {
  try {
    const subscriptions = await subscriptionsService.getTipsterSubscribers(req.user.userId);
    res.json({ data: subscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkSubscriptionStatus = async (req, res) => {
  try {
    const { tipsterId } = req.params;
    const status = await subscriptionsService.getSubscriptionStatus(req.user.userId, tipsterId);
    res.json({ data: status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getMySubscriptions,
  getMySubscribers,
  checkSubscriptionStatus,
};
