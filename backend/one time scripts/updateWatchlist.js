import mongoose from "mongoose";
import User from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { envVars } from "../config/envVars.js";

await mongoose.connect(envVars.MONGO_URI);

const users = await User.find();

for (const user of users) {
  for (const item of user.watchList) {
    try {
      if (!item.release_date && item.type === "movie") {
        const data = await fetchFromTMDB(
          `https://api.themoviedb.org/3/movie/${item.id}?language=en-US`,
        );

        if (data?.release_date) {
          await User.updateOne(
            { _id: user._id, "watchList.id": item.id },
            { $set: { "watchList.$.release_date": data.release_date } },
          );

          console.log(`Updated movie ${item.id}`);
        }
      }

      if (!item.release_date && item.type === "tv") {
        const data = await fetchFromTMDB(
          `https://api.themoviedb.org/3/tv/${item.id}?language=en-US`,
        );

        if (data?.first_air_date) {
          await User.updateOne(
            { _id: user._id, "watchList.id": item.id },
            { $set: { "watchList.$.release_date": data.first_air_date } },
          );

          console.log(`Updated TV ${item.id}`);
        }
      }
    } catch (err) {
      console.log(`Skipping item ${item.id} (${item.type}) - not found`);
    }
  }
}

console.log("Release dates added to old watchlist items");
process.exit();
