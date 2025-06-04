import axios from "axios";
import { envVars } from "../config/envVars.js";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    error.code === "ECONNRESET" ||
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

export const fetchFromTMDB = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${envVars.TMDB_API_KEY}`,
      },
      timeout: 5000, // Timeout in ms
    });

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
