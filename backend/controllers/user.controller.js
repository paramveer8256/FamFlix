import User from "../models/user.model.js";

export async function setAvatar(req, res) {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).json({
      success: false,
      message: "Avatar is required",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { image: avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}