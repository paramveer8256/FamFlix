import { fetchAnimeData } from "../services/tmdb.service.js";
import axios from "axios";
export const getAnime = async (req, res) => {
  const { episodeId } = req.params; // Extract category from request parameters
  try {
    const data = await fetchAnimeData(
      `https://consumet-api-production-538a.up.railway.app/anime/9anime/info/spy-x-family.6ll19`
    ); // Fetch data from the API

    if (!data) {
      return res
        .status(404)
        .json({ message: "Data not found" }); // Return to prevent further execution
    }

    res.status(200).json({ success: true, content:data});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};



export async function getTrendingAnime(req, res) {
  try {
    const data = await fetchAnimeData(
      "https://api.jikan.moe/v4/random/anime"
    );
    const image = await fetchAnimeData(
      "https://api.nekosapi.com/v4/images/5114"
    );

    res.json({
      success: true,
      content: data.data,
      images: image,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the trending movie.",
      error: error.message,
    });
  }
}

export async function getAnimeGenres(req, res) {
  try {
    const data = await fetchAnimeData(
      "https://api.jikan.moe/v4/genres/anime"
    );
    res.json({
      success: true,
      genres: data.data,
      type: "movie",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while fetching the movie genres.",
      error: error.message,
    });
  }
}
