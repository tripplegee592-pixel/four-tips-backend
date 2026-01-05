const adminService = require("./admin.service");

const getDashboard = async (req, res) => {
  try {
    const stats = await adminService.getAdminDashboard();
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive === "true",
    };

    const users = await adminService.getAllUsers(filters);
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["USER", "TIPSTER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await adminService.updateUserRole(req.params.userId, role);
    res.json({ message: "User role updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await adminService.deactivateUser(req.params.userId);
    res.json({ message: "User deactivated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await adminService.activateUser(req.params.userId);
    res.json({ message: "User activated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTips = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      sport: req.query.sport,
    };

    const tips = await adminService.getAllTips(filters);
    res.json({ data: tips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTipStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const tip = await adminService.updateTipStatus(req.params.tipId, status);
    res.json({ message: "Tip status updated successfully", data: tip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTip = async (req, res) => {
  try {
    const result = await adminService.deleteTip(req.params.tipId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  getAllTips,
  updateTipStatus,
  deleteTip,
};
