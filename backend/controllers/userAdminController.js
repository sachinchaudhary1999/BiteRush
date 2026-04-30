import userModel from "../models/userModel.js";

const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password -cartData");
    res.json({ success: true, data: users });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const removeUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "User Removed" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const blockUser = async (req, res) => {
  try {
    // We add a blocked field on the fly
    await userModel.findByIdAndUpdate(req.body.id, { blocked: req.body.block });
    res.json({ success: true, message: req.body.block ? "User Blocked" : "User Unblocked" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

export { listUsers, removeUser, blockUser };
