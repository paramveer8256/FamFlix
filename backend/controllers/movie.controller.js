import { parse } from "path";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );

    const randomMovie =
      data.results && data.results.length > 0
        ? data.results[
            Math.floor(Math.random() * data.results.length)
          ]
        : null;
    if (!randomMovie) {
      return res.status(404).json({
        success: false,
        message: "No trending movies found.",
      });
    }

    res.json({ success: true, content: randomMovie });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the trending movie.",
      error: error.message,
    });
  }
}

export async function getMovieTrailers(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );

    res.json({ success: true, trailers: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "Movie not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the movie trailers.",
      error: error.message,
    });
  }
}
export async function getMovieDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    res.json({ success: true, details: data });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "Movie not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the movie trailers.",
      error: error.message,
    });
  }
}

export async function getCategory(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );

    const randomMovie =
      data.results && data.results.length > 0
        ? data.results[
            Math.floor(Math.random() * data.results.length)
          ]
        : null;
    if (!randomMovie) {
      return res.status(404).json({
        success: false,
        message: "No category movies found.",
      });
    }
    res.json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the movie by category.",
      error: error.message,
    });
  }
}
export async function getSimilarMovie(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    // const randomMovie =
    //   data.results && data.results.length > 0
    //     ? data.results[
    //         Math.floor(Math.random() * data.results.length)
    //       ]
    //     : null;
    // if (!randomMovie) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No similar movies found.",
    //   });
    // }
    res.json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the similar movie.",
      error: error.message,
    });
  }
}

export async function getGenres(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/genre/movie/list?language=en-US"
    );
    res.json({ success: true, genres: data.genres });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the movie genres.",
      error: error.message,
    });
  }
}

export async function getGenreMovies(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&language=en-US&page=${page}`
    );
    res.json({
      success: true,
      content: data.results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the movies by genre.",
      error: error.message,
    });
  }
}

export async function getActorMovies(req, res) {
  const { id } = req.params;
  const actorId = parseInt(id);

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?language=en-US`
    );
    res.json({ success: true, content: data.cast });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "Actor not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the actor's movies.",
      error: error.message,
    });
  }
}
