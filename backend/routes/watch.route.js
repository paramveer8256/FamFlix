import express from "express";
import {
  clearWatchList,
  deleteWatchList,
  getWatchList,
  setmovieToWatchList,
  settvToWatchList,
} from "../controllers/watch.controller.js";

const router = express.Router();

router.post("/movie/:id", setmovieToWatchList);
router.post("/tv/:id", settvToWatchList);

router.get("/movies", getWatchList);

router.delete("/movies/clear", clearWatchList);
router.delete("/movie/:id", deleteWatchList);

export default router;
