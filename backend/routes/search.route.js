import express from "express";
import {
  searchMovie,
  searchPerson,
  getSearchHistory,
  deleteSearchHistory,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);

router.get("/history", getSearchHistory);

router.delete("/history/:id", deleteSearchHistory);

export default router;
