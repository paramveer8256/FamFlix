import express from "express";
import { getOrCreateConversation } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages } from "../controllers/chat.controller.js";
import { sendMessage } from "../controllers/chat.controller.js";
import { markMessagesAsRead } from "../controllers/chat.controller.js";
import { getUnreadCounts } from "../controllers/chat.controller.js";
import { getConversations } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/conversation/:userId", protectRoute, getOrCreateConversation);
router.get("/conversation/:conversationId/messages", protectRoute, getMessages);
router.post(
  "/conversation/:conversationId/messages",
  protectRoute,
  sendMessage,
);
router.patch(
  "/conversation/:conversationId/read",
  protectRoute,
  markMessagesAsRead,
);
router.get("/unread", protectRoute, getUnreadCounts);
router.get("/", protectRoute, getConversations);

export default router;
