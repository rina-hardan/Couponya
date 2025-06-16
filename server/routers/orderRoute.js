import express from "express";
import ordersController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/create", ordersController.createOrder);
orderRouter.get("/orders/:customerId", ordersController.getOrdersByCustomer);
export default orderRouter;