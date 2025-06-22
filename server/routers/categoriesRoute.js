import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
const categoriesRouter = express.Router();

categoriesRouter.post("/create", verifyToken, isAdmin, upload.single("img_url"), categoriesController.addCategory);

categoriesRouter.get("/", categoriesController.getCategories);

export default categoriesRouter;
