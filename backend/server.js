import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import animeRoutes from "./routes/anime.route.js";
import searchRoutes from "./routes/search.route.js";
import watchListRoutes from "./routes/watch.route.js";
import watchHistoryRoutes from "./routes/watchHistory.route.js";

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
app.use("/api/v1/user", protectRoute, userRoutes);
app.use("/api/v1/anime", protectRoute, animeRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/watchlist", protectRoute, watchListRoutes);
app.use(
  "/api/v1/watchhistory",
  protectRoute,
  watchHistoryRoutes
);

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

// import express from "express";
// import http from "http";
// import { Server as SocketIOServer } from "socket.io";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// import userRoutes from "./routes/user.route.js";
// import authRoutes from "./routes/auth.route.js";
// import movieRoutes from "./routes/movie.route.js";
// import tvRoutes from "./routes/tv.route.js";
// import animeRoutes from "./routes/anime.route.js";
// import searchRoutes from "./routes/search.route.js";
// import watchListRoutes from "./routes/watch.route.js";
// import watchHistoryRoutes from "./routes/watchHistory.route.js";

// import { envVars } from "./config/envVars.js";
// import { connectDB } from "./config/db.js";
// import { protectRoute } from "./middleware/protectRoute.js";
// import  initSocket  from "./socket.js";

// const app = express();
// const PORT = envVars.PORT;
// const __dirname = path.resolve();

// // Setup HTTP server
// const httpServer = http.createServer(app);

// // Setup socket.io
// const io = new SocketIOServer(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// // Init socket logic
// initSocket(io);

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// // Routes
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/user", protectRoute, userRoutes);
// app.use("/api/v1/anime", protectRoute, animeRoutes);
// app.use("/api/v1/movie", protectRoute, movieRoutes);
// app.use("/api/v1/tv", protectRoute, tvRoutes);
// app.use("/api/v1/search", protectRoute, searchRoutes);
// app.use("/api/v1/watchlist", protectRoute, watchListRoutes);
// app.use(
//   "/api/v1/watchhistory",
//   protectRoute,
//   watchHistoryRoutes
// );

// // Serve frontend in production
// if (envVars.NODE_ENV === "production") {
//   app.use(
//     express.static(path.join(__dirname, "/frontend/dist"))
//   );
//   app.get("*", (req, res) =>
//     res.sendFile(
//       path.resolve(
//         __dirname,
//         "frontend",
//         "dist",
//         "index.html"
//       )
//     )
//   );
// }

// // Start server
// httpServer.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
//   connectDB();
// });
