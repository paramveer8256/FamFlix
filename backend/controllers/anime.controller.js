import { fetchAnimeData } from "../services/tmdb.service.js";

export const getAnime = async (req, res) => {
  const { episodeId } = req.params; // Extract category from request parameters
  try {
    const data = await fetchAnimeData(
      `https://api.jikan.moe/v4/anime/5114/recommendations`
    ); // Fetch data from the API

    if (!data) {
      return res
        .status(404)
        .json({ message: "Data not found" }); // Return to prevent further execution
    }

    res.status(200).json({ success: true, content:data.data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};
