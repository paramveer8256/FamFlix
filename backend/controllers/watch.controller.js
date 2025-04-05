// import { fetchMovieData } from "../services/tmdb.service.js";
// export async function getMovie(req, res) {
//   // "
//   const { id } = req.params;
//   try {
//     const data = await fetchMovieData(
//       `https://vidsrc.me/embed/movie?tmdb=${id}`
//     );
//     res.json({ success: true });
//   } catch (error) {
//     if (error.message.includes("404")) {
//       res.status(404).json({
//         message: "Movie not found",
//       });
//     }
//     res.status(500).json({
//       message:
//         "An error occurred while fetching the movie trailers.",
//       error: error.message,
//     });
//   }
// }
