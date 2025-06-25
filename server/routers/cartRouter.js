// cartRouter.js
import express from "express";
import cartController from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", verifyToken, cartController.addToCart);
cartRouter.get("/", verifyToken, cartController.getCartItems);
cartRouter.delete("/remove", verifyToken, cartController.removeFromCart);
cartRouter.put("/updateQuantity", verifyToken, cartController.updateItemQuantity);

export default cartRouter;
