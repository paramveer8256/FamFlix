import { fetchAnimeData } from "../services/tmdb.service.js";


export const getAnime = async (req, res) => {
  const { category } = req.params; // Extract category from request parameters
  try {
      const data = await fetchAnimeData("https://api.nekosia.cat/api/v1/images/" + category); // Fetch data from the API
      
      if (!data) {
          return res.status(404).json({ message: "Data not found" }); // Return to prevent further execution
      }
      res.status(200).json({ success: true, content: data });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
