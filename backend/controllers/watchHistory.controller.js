import { fetchFromTMDB } from "../services/tmdb.service.js";
import User from "../models/user.model.js";

export async function setContent(req, res) {
  const { id, category } = req.body;

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/${category}/${id}?language=en-US`
    );

    if (!data) {
      return res
        .status(404)
        .json({ message: "No movie found" });
    }

    // Remove if already exists
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchHistory: { id: data.id } },
    });

    // Add to beginning, keep only 5
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchHistory: {
          $each: [
            {
              id: data.id,
              title: data.title || data.name,
              type: category,
              image: data.poster_path || data.backdrop_path,
              created: new Date(),
            },
          ],
          $position: 0,
          $slice: 5,
        },
      },
    });

    res.status(200).json({
      success: true,
      content: data,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function getWatchHistory(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      content: user.watchHistory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}