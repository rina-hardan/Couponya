import express from "express";
import ordersController from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/create",verifyToken, ordersController.createOrder);
orderRouter.get("/",verifyToken, ordersController.getOrdersByCustomer);
export default orderRouter;