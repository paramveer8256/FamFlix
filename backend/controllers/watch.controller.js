import User from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function setmovieToWatchList(req, res) {
  const { id } = req.params;

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );

    if (!data) {
      return res
        .status(404)
        .json({ message: "No movie found" });
    }
    // Get user and check if movie already in watch list
    const user = await User.findById(req.user._id);

    const alreadyExists = user.watchList.some(
      (item) => item.id === data.id
    );

    if (alreadyExists) {
      return res
        .status(409)
        .json({ message: "Movie already in watch list" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchList: {
          id: data.id,
          title: data.title,
          type: "movie",
          image: data.poster_path,
          created: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}
export async function settvToWatchList(req, res) {
  const { id } = req.params;

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );

    if (!data) {
      return res
        .status(404)
        .json({ message: "No movie found" });
    }
    // Get user and check if movie already in watch list
    const user = await User.findById(req.user._id);

    const alreadyExists = user.watchList.some(
      (item) => item.id === data.id
    );

    if (alreadyExists) {
      return res
        .status(409)
        .json({ message: "TV Show already in watch list" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchList: {
          id: data.id,
          title: data.name,
          type: "tv",
          image: data.poster_path,
          created: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function getWatchList(req, res) {
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
      content: req.user.watchList,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function deleteWatchList(req, res) {
  let { id } = req.params;
  id = parseInt(id, 10); // Convert id to an integer
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        watchList: {
          id: id,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Item removed from watch list",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function clearWatchList(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.watchList = []; // Clear the array
    await user.save(); // <-- MISSING AWAIT WAS HERE

    res
      .status(200)
      .json({ message: "Watch list cleared successfully" });
  } catch (error) {
    console.error("Error in clearWatchList:", error);
    res
      .status(500)
      .json({ message: "Failed to clear watch list" });
  }
}
