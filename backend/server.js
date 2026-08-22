import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "./models/user.model.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import animeRoutes from "./routes/anime.route.js";
import searchRoutes from "./routes/search.route.js";
import watchListRoutes from "./routes/watch.route.js";
import watchHistoryRoutes from "./routes/watchHistory.route.js";
import friendRoutes from "./routes/friend.route.js";
import chatRoutes from "./routes/chat.route.js";

import { envVars } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const server = http.createServer(app);

const PORT = envVars.PORT;
const __dirname = path.resolve();

/* =========================================================
   EXPRESS MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* =========================================================
   SOCKET.IO
========================================================= */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Make Socket.IO accessible inside controllers
app.set("io", io);

const onlineUsers = new Map();

/* =========================================================
   SOCKET AUTHENTICATION
========================================================= */

io.use(async (socket, next) => {
  try {
    console.log("🔌 Socket authentication attempt");

    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split("; ")
      .find((cookie) => cookie.startsWith("jwt="))
      ?.substring(4);

    if (!token) {
      console.log("❌ No JWT found");
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, envVars.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("❌ User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;

    console.log(`✅ Socket authenticated: ${user.username}`);

    next();
  } catch (error) {
    console.error("❌ Socket authentication error:", error);

    next(new Error("Unauthorized"));
  }
});

/* =========================================================
   BROADCAST ONLINE STATUS
========================================================= */

const broadcastOnlineStatus = (userId, online) => {
  io.emit("user_status_changed", {
    userId,
    online,
  });
};

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", async (socket) => {
  const userId = socket.user._id.toString();

  try {
    /* -------------------------------------------------------
       ONLINE USERS
    ------------------------------------------------------- */

    const connections = onlineUsers.get(userId) || 0;

    onlineUsers.set(userId, connections + 1);

    await User.findByIdAndUpdate(userId, {
      online: true,
    });

    broadcastOnlineStatus(userId, true);

    const onlineUserIds = Array.from(onlineUsers.keys());

    socket.emit("online_users", onlineUserIds);

    console.log(`🟢 ${socket.user.username} connected`);
    // Join a private room for this user
    socket.join(`user:${userId}`);

    console.log(`👤 ${socket.user.username} joined user room: user:${userId}`);
    /* -------------------------------------------------------
       JOIN CONVERSATION
    ------------------------------------------------------- */

    socket.on("join_conversation", (conversationId) => {
      if (!conversationId) {
        return;
      }

      const room = `conversation:${conversationId}`;

      socket.join(room);

      console.log(`💬 ${socket.user.username} joined ${room}`);
    });

    /* -------------------------------------------------------
       LEAVE CONVERSATION
    ------------------------------------------------------- */

    socket.on("leave_conversation", (conversationId) => {
      if (!conversationId) {
        return;
      }

      const room = `conversation:${conversationId}`;

      socket.leave(room);

      console.log(`💬 ${socket.user.username} left ${room}`);
    });

    /* -------------------------------------------------------
       DISCONNECT
    ------------------------------------------------------- */

    socket.on("disconnect", async () => {
      try {
        const currentConnections = onlineUsers.get(userId) || 0;

        if (currentConnections <= 1) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            online: false,
          });

          broadcastOnlineStatus(userId, false);

          console.log(`🔴 ${socket.user.username} disconnected`);
        } else {
          onlineUsers.set(userId, currentConnections - 1);

          console.log(`🔌 ${socket.user.username} disconnected one connection`);
        }
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  } catch (error) {
    console.error("Socket connection error:", error);
  }
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", protectRoute, userRoutes);

app.use("/api/v1/anime", protectRoute, animeRoutes);

app.use("/api/v1/movie", protectRoute, movieRoutes);

app.use("/api/v1/tv", protectRoute, tvRoutes);

app.use("/api/v1/search", protectRoute, searchRoutes);

app.use("/api/v1/watchlist", protectRoute, watchListRoutes);

app.use("/api/v1/friends", friendRoutes);

app.use("/api/v1/chats", chatRoutes);

app.use("/api/v1/watchhistory", protectRoute, watchHistoryRoutes);

/* =========================================================
   PRODUCTION FRONTEND
========================================================= */

if (envVars.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

/* =========================================================
   START SERVER
========================================================= */

server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);

  connectDB();
});
