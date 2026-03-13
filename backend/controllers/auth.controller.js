import User from "../models/user.model.js";
import crypto from "crypto";
import axios from "axios";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one special letter and one number",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const PROFILE_PICS = [
      "/avatars/old/avatar1.png",
      "/avatars/old/avatar2.png",
      "/avatars/old/avatar3.png",
    ];
    const randomIndex = Math.floor(Math.random() * PROFILE_PICS.length);
    const image = PROFILE_PICS[randomIndex];

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      image,
    });

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    // Save user to database
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { emailorusername, password } = req.body;

    if (!emailorusername || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists using either email or username
    const user = await User.findOne({
      $or: [
        { email: emailorusername.toLowerCase() },
        { username: emailorusername },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email (example)
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "FAMFLIX",
          email: "paramveer8256@gmail.com",
        },
        to: [{ email: user.email }],
        subject: "Password Reset Request",
        htmlContent: `
<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

    <div style="background:#2563eb; padding:20px; text-align:center;">
      <h1 style="color:white; margin:0;">FAMFLIX</h1>
    </div>

    <div style="padding:30px; color:#333;">
      <h2 style="margin-top:0;">Reset Your Password</h2>

      <p style="font-size:16px;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" 
           style="background:#2563eb; color:white; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
           Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#666;">
        This link will expire in <b>10 minutes</b>. If you did not request a password reset, you can safely ignore this email.
      </p>

      <p style="margin-top:30px;">
        Thanks,<br/>
        <b>FAMFLIX Team</b>
      </p>
    </div>

    <div style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px; color:#666;">
      © ${new Date().getFullYear()} FAMFLIX. All rights reserved.
    </div>

  </div>
</div>
`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain one number and one special character",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one special character and one number",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error in changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Error in authCheck:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
