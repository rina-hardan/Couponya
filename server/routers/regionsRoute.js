import express from "express";
import regionsController from "../controllers/regionsController.js";
import { verifyToken } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { addRegionValidator } from "../middleware/validators/regionValidator.js";

const regionsRouter = express.Router();

regionsRouter.post(
  "/add",
  verifyToken,
  addRegionValidator,
  validate,
  regionsController.addRegion
);

regionsRouter.get("/", regionsController.getRegions);

export default regionsRouter;
