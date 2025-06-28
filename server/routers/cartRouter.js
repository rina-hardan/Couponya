import express from "express";
import cartController from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  addToCartValidator,
  removeFromCartValidator,
  updateQuantityValidator,
} from "../middleware/validators/cartValidator.js";

const cartRouter = express.Router();

cartRouter.post("/add", verifyToken, addToCartValidator, validate, cartController.addToCart);
cartRouter.get("/", verifyToken, cartController.getCartItems);
cartRouter.delete("/remove", verifyToken, removeFromCartValidator, validate, cartController.removeFromCart);
cartRouter.put("/updateQuantity", verifyToken, updateQuantityValidator, validate, cartController.updateItemQuantity);

export default cartRouter;
