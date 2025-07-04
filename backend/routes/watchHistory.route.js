import express from "express";
import {
  setContent,
  getWatchHistory,
} from "../controllers/watchHistory.controller.js";

const router = express.Router();

router.post("/setcontent", setContent);

router.get("/history", getWatchHistory);

export default router;
