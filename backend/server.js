import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import animeRoutes from "./routes/anime.route.js";
import searchRoutes from "./routes/search.route.js";
import watchListRoutes from "./routes/watch.route.js"

import { envVars } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const PORT = envVars.PORT;
const __dirname = path.resolve();

app.use(express.json());

app.use(cookieParser());

// Allow requests from any origin (adjust for security)
app.use(cors());

// OR configure it for specific origins
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/anime", protectRoute, animeRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/watchlist", protectRoute, watchListRoutes);

if (envVars.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "/frontend/dist"))
  );
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "frontend",
        "dist",
        "index.html"
      )
    );
  });
}

app.listen(PORT, () => {
  console.log("server stated " + PORT);
  connectDB();
});
