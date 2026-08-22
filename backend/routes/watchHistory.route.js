import express from "express";
import {
  setContent,
  getWatchHistory,
  getUserWatchHistory,
} from "../controllers/watchHistory.controller.js";

const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";

router.post("/setcontent", setContent);

router.get("/history", getWatchHistory);
router.get(
  "/user/:userId",
  protectRoute,
  getUserWatchHistory
);

export default router;
