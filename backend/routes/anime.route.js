import express from "express";
import {
  getAnime,
  getAnimeGenres,
  getTrendingAnime,
  getAnimeSearch,
  getEpisodes,
  getAnimeFull,
  getRecommendations,
} from "../controllers/anime.controller.js";

const router = express.Router();

router.get("/info", getAnime);
router.get("/trending", getTrendingAnime);
router.get("/genre", getAnimeGenres);
router.get("/search", getAnimeSearch);
router.get("/episodes", getEpisodes);
router.get("/full", getAnimeFull);
router.get("/recommendations", getRecommendations);
// router.get("/actor/:id", getActorMovies);
// router.get("/:id/trailers", getMovieTrailers);
// router.get("/:id/details", getMovieDetails);
// router.get("/:id/similar", getSimilarMovie);
// router.get("/:category", getCategory);

export default router;
