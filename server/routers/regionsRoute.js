import express from "express";
import regionsController from "../controllers/regionsController.js";
import { verifyToken } from "../middleware/auth.js";

const regionsRouter = express.Router();

regionsRouter.post("/add", verifyToken, regionsController.addRegion);
regionsRouter.get("/", regionsController.getRegions);
export default regionsRouter;