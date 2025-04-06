import User from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchMovie(req, res) {
  const { query } = req.params;
  const page = parseInt(req.query.page) || 1;

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    );

    if (!data || data.results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found" });
    }

    if (page === 1) {
      const firstResult = data.results[0];
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: firstResult.id,
            title: firstResult.title,
            searchType: "movie",
            image: firstResult.poster_path,
            created: new Date(),
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      content: data.results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results, // optional
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function searchPerson(req, res) {
  const { query } = req.params; // Extract query from request parameters
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (!data) {
      return res
        .status(404)
        .json({ message: "Data not found" }); // Return to prevent further execution
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          title: data.results[0].name,
          searchType: "person",
          image: data.results[0].profile_path,
          created: new Date(),
        },
      },
    });
    res
      .status(200)
      .json({ success: true, content: data.results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
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
      content: req.user.searchHistory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function deleteSearchHistory(req, res) {
  let { id } = req.params;
  id = parseInt(id, 10); // Convert id to an integer
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: {
          id: id,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Item removed from history",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
}

export async function clearSearchHistory(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.searchHistory = []; // Clear the array
    await user.save(); // <-- MISSING AWAIT WAS HERE

    res
      .status(200)
      .json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error in clearSearchHistory:", error);
    res
      .status(500)
      .json({ message: "Failed to clear history" });
  }
}
