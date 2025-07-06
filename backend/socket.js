// socket.js
import User from "./models/user.model.js";

/**
 * Initializes socket connection logic
 * @param {import("socket.io").Server} io - The Socket.IO server instance
 */
const initSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) return;

    // Mark user as online
    User.findByIdAndUpdate(userId, { online: true })
      .then(() => {
        console.log(`User ${userId} is now online`);
        io.emit("user-online", userId); // Notify all
      })
      .catch(console.error);

    // On disconnect
    socket.on("disconnect", () => {
      User.findByIdAndUpdate(userId, { online: false })
        .then(() => {
          console.log(`User ${userId} is now offline`);
          io.emit("user-offline", userId); // Notify all
        })
        .catch(console.error);
    });
  });
};

export default initSocket;
