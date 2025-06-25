import express from "express";
import {
  getAnime,
  getAnimeGenres,
  getTrendingAnime,
} from "../controllers/anime.controller.js";

const router = express.Router();

router.get("/info", getAnime);
router.get("/trending", getTrendingAnime);
router.get("/genre", getAnimeGenres);
// router.get("/credits/:id", getMovieCredits);
// router.get("/genre/:id", getGenreMovies);
// router.get("/actor/:id", getActorMovies);
// router.get("/:id/trailers", getMovieTrailers);
// router.get("/:id/details", getMovieDetails);
// router.get("/:id/similar", getSimilarMovie);
// router.get("/:category", getCategory);

export default router;
