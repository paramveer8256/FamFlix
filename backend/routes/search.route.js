import express from "express";
import {
  searchMovie,
  searchTV,
  searchPerson,
  getSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTV);

router.get("/history", getSearchHistory);

router.delete("/history/clear", clearSearchHistory);
router.delete("/history/:id", deleteSearchHistory);

export default router;
