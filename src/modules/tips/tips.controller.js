const tipsService = require("./tips.service");

const createTip = async (req, res) => {
  try {
    const { title, description, sport, matchDate, odds, prediction, isPremium } = req.body;

    if (!title || !description || !sport || !matchDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tip = await tipsService.createTip(
      { title, description, sport, matchDate: new Date(matchDate), odds, prediction, isPremium },
      req.user.userId
    );

    res.status(201).json({ message: "Tip created successfully", data: tip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTip = async (req, res) => {
  try {
    const tip = await tipsService.getTipById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });
    res.json({ data: tip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTips = async (req, res) => {
  try {
    const filters = {
      sport: req.query.sport,
      tipsterId: req.query.tipsterId,
      status: req.query.status,
    };

    const tips = await tipsService.getAllTips(filters);
    res.json({ data: tips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTip = async (req, res) => {
  try {
    const tip = await tipsService.updateTip(req.params.id, req.body, req.user.userId);
    res.json({ message: "Tip updated successfully", data: tip });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(403).json({ message: "You can only update your own tips" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteTip = async (req, res) => {
  try {
    await tipsService.deleteTip(req.params.id, req.user.userId);
    res.json({ message: "Tip deleted successfully" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(403).json({ message: "You can only delete your own tips" });
    }
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await tipsService.addReview(req.params.id, req.user.userId, rating, comment);
    res.status(201).json({ message: "Review added successfully", data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTip,
  getTip,
  getAllTips,
  updateTip,
  deleteTip,
  addReview,
};
