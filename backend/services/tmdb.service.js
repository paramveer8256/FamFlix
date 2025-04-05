import axios from "axios";
import { envVars } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
  try {
    const options = {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + envVars.TMDB_API_KEY,
      },
    };
    const res = await axios.get(url, options);
    if (res.status !== 200) {
      throw new Error("Failed to fetch data from TMDB API");
    }
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching data from TMDB API:",
      error.message
    );
    throw new Error("Failed to fetch data from TMDB API");
  }
};

export const fetchAnimeData = async (url) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(url, options); // Pass only headers as options
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return null; // Return null to indicate failure
  }
};

// export const fetchMovieData = async (url) => {
//   const options = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   try {
//     const response = await axios.get(url, options); // Pass only headers as options
//     return response; // Return the data directly
//   } catch (error) {
//     console.error("Error fetching anime data:", error);
//     return null; // Return null to indicate failure
//   }
// };
