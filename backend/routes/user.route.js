import express from "express";
import { setAvatar } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/updateAvatar", setAvatar);

export default router;
