import express from "express";
import {
  clearWatchList,
  deleteWatchList,
  getWatchList,
  setmovieToWatchList,
} from "../controllers/watch.controller.js";

const router = express.Router();

router.get("/movies", getWatchList);
router.get("/movie/:id", setmovieToWatchList);

router.delete("/movies/clear", clearWatchList);
router.delete("/movie/:id", deleteWatchList);

export default router;
