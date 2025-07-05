import express from "express";
import { setInfo } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/updateInfo", setInfo);

export default router;
