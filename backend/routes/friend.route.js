import express from "express";
import { sendFriendRequest } from "../controllers/friend.controller.js";
import { getFriendRequests } from "../controllers/friend.controller.js";
import { acceptFriendRequest } from "../controllers/friend.controller.js";
import { getFriends } from "../controllers/friend.controller.js";
import { rejectFriendRequest } from "../controllers/friend.controller.js";
import { removeFriend } from "../controllers/friend.controller.js";
import { searchUsers } from "../controllers/friend.controller.js";
import { getFriendshipStatus } from "../controllers/friend.controller.js";
import { getFriendProfile } from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.patch("/request/:requestId/accept", protectRoute, acceptFriendRequest);
router.get("/", protectRoute, getFriends);
router.patch("/request/:requestId/reject", protectRoute, rejectFriendRequest);
router.delete("/:userId", protectRoute, removeFriend);
router.get("/search", protectRoute, searchUsers);
router.get("/status/:userId", protectRoute, getFriendshipStatus);
router.get("/profile/:userId", protectRoute, getFriendProfile);
export default router;
