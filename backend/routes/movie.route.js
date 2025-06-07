import express from "express";
import {
  getMovieTrailers,
  getMovieDetails,
  getTrendingMovie,
  getSimilarMovie,
  getCategory,
  getGenres,
  getGenreMovies,
  getActorMovies,
  getMovieCredits
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/trending", getTrendingMovie);
router.get("/genre", getGenres);
router.get("/credits/:id", getMovieCredits);
router.get("/genre/:id", getGenreMovies);
router.get("/actor/:id", getActorMovies);
router.get("/:id/trailers", getMovieTrailers);
router.get("/:id/details", getMovieDetails);
router.get("/:id/similar", getSimilarMovie);
router.get("/:category", getCategory);

export default router;
