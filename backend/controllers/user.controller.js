import User from "../models/user.model.js";

export async function setInfo(req, res) {
  const { avatar, username, email } = req.body;
  if (!avatar && !username && !email) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, image: avatar },
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
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}
