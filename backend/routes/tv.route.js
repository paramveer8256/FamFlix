import express from "express";
import {
  getTVTrailers,
  getTVDetails,
  getTrendingTV,
  getSimilarTV,
  getCategory,
  getGenres,
  getGenreTVShows,
  getTVCredits,
  getActorTVShows,
  getTVReviews,
} from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTV);
router.get("/genre", getGenres);
router.get("/reviews/:id", getTVReviews); // Assuming reviews are fetched via credits endpoint
router.get("/credits/:id", getTVCredits);
router.get("/genre/:id", getGenreTVShows);
router.get("/actor/:id", getActorTVShows);
router.get("/:id/trailers", getTVTrailers);
router.get("/:id/details", getTVDetails);
router.get("/:id/similar", getSimilarTV);
router.get("/:category", getCategory);

export default router;
