import express from "express";
import regionsController from "../controllers/regionsController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
const regionsRouter = express.Router();

regionsRouter.post("/add", verifyToken, upload.single("img_url"), regionsController.addRegion);
regionsRouter.get("/", regionsController.getRegions);
export default regionsRouter;