import express from "express";
import ordersController from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";
import { createOrderValidator } from "../middleware/validators/orderValidator.js";
import validate from "../middleware/validate.js";

const orderRouter = express.Router();

orderRouter.post("/create", verifyToken, createOrderValidator, validate, ordersController.createOrder);
orderRouter.get("/", verifyToken, ordersController.getOrdersByCustomer);

export default orderRouter;
