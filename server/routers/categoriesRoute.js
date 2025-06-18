import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/create",verifyToken,isAdmin, categoriesController.addCategory);

categoriesRouter.get("/", categoriesController.getCategories);

export default categoriesRouter;
