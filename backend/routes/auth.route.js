import express from "express";
import {
  signup,
  login,
  logout,
  authCheck,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.patch("/change-password", protectRoute, changePassword);

router.get("/authCheck", protectRoute, authCheck);
export default router;
