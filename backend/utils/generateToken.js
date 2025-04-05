import jwt from "jsonwebtoken";
import { envVars } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, envVars.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds\
    sameSite: "strict",
    secure: envVars.NODE_ENV !== "development",
  });
  return token;
};
