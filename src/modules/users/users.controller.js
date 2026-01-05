const userService = require("./users.service");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.userId, req.body);
    res.json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await userService.deleteUserAccount(req.user.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }
    const result = await userService.changePassword(req.user.userId, oldPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  changePassword,
};
