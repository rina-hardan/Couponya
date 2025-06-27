import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {categoryValidator} from "../middleware/validators/categoriesValidator.js";
import validate from "../middleware/validate.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("img_url"),
  categoryValidator,   
  validate,         
  categoriesController.addCategory
);

categoriesRouter.get("/", categoriesController.getCategories);

export default categoriesRouter;
