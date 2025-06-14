import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTV(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    );

    const randomTVShow =
      data.results && data.results.length > 0
        ? data.results[
            Math.floor(Math.random() * data.results.length)
          ]
        : null;
    if (!randomTVShow) {
      return res.status(404).json({
        success: false,
        message: "No trending TV shows found.",
      });
    }

    res.json({ success: true, content: randomTVShow });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the trending TV shows.",
      error: error.message,
    });
  }
}

export async function getTVTrailers(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );

    res.json({ success: true, trailers: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "TV show not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the TV show trailers.",
      error: error.message,
    });
  }
}
export async function getTVDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );
    res.json({ success: true, details: data });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "TV show not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the TV show details.",
      error: error.message,
    });
  }
}
export async function getTVCredits(req, res) {
  const { id } = req.params;
  const tvShowId = parseInt(id);
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${tvShowId}/credits?language=en-US`
    );
    res.json({ success: true, casts: data.cast });
  } catch (error) {
    if (error.message.includes("404")) {
      res.status(404).json({
        message: "TV show not found",
      });
    }
    res.status(500).json({
      message:
        "An error occurred while fetching the TV show trailers.",
      error: error.message,
    });
  }
}

export async function getCategory(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    );

    const randomTVShow =
      data.results && data.results.length > 0
        ? data.results[
            Math.floor(Math.random() * data.results.length)
          ]
        : null;
    if (!randomTVShow) {
      return res.status(404).json({
        success: false,
        message: "No category TV shows found.",
      });
    }
    res.json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the TV shows by category.",
      error: error.message,
    });
  }
}
export async function getSimilarTV(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    );
    // const randomTVShow =
    //   data.results && data.results.length > 0
    //     ? data.results[
    //         Math.floor(Math.random() * data.results.length)
    //       ]
    //     : null;
    // if (!randomTVShow) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No similar TV shows found.",
    //   });
    // }
    res.json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the similar TV shows.",
      error: error.message,
    });
  }
}

export async function getGenres(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/genre/tv/list?language=en-US"
    );
    res.json({ success: true, genres: data.genres ,type : "tv"});
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the TV show genres.",
      error: error.message,
    });
  }
}

export async function getGenreTVShows(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/discover/tv?with_genres=${id}&language=en-US&page=${page}`
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
        "An error occurred while fetching the TV shows by genre.",
      error: error.message,
    });
  }
}

export async function getActorTVShows(req, res) {
  const { id } = req.params;
  const actorId = parseInt(id);

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/person/${actorId}/tv_credits?language=en-US`
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
