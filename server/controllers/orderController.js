import ordersModel from "../models/orderModels.js";
import couponsModel from "../models/couponModels.js";
import sendMail from "../utils/mailer.js";
import DB from "../DB/DBconnection.js";

const ordersController = {
  createOrder: async (req, res) => {
    const { items, usePoints } = req.body;
    const customerId = req.userId;
    const customerEmail = req.Email;
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required data" });
    }
    const connection = await DB.getConnection();

    try {
      await connection.beginTransaction();

      let totalPrice = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

      const currentPoints = await ordersModel.getCustomerPoints(customerId, connection);
      let pointsUsed = 0;
      if (usePoints) {
        pointsUsed = Math.min(currentPoints, totalPrice);
        totalPrice -= pointsUsed;
      }

      const pointsEarned = Math.floor(totalPrice * 0.05);
      const updatedPoints = currentPoints - pointsUsed + pointsEarned;

      const orderDate = new Date();
      const orderId = await ordersModel.createOrder(customerId, totalPrice, orderDate, connection);

      const orderItems = items.map(item => [
        orderId,
        item.couponId,
        item.quantity,
        item.pricePerUnit,
        item.pricePerUnit * item.quantity
      ]);

      await ordersModel.bulkAddOrderItems(orderItems, connection);
      await ordersModel.updateCustomerPoints(customerId, updatedPoints, connection);

      const couponIds = items.map(item => item.couponId);
      const coupons = await couponsModel.getCouponsByIds(couponIds, connection); 
      const couponCodes = coupons.map(c => c.code).join(", ");

      await connection.commit();

      const emailText = `Thank you for your order! Your coupon codes are:\n${couponCodes}`;
      await sendMail(customerEmail, "Your Coupons", emailText);

      res.status(201).json({
        message: "Order created and email sent successfully",
        orderId,
        totalPrice,
        pointsUsed,
        pointsEarned,
        updatedPoints
      });

    } catch (error) {
      await connection.rollback();

      console.error("Error during order creation:", error.message);

      res.status(500).json({
        error: "Something went wrong while creating your order. Please try again later."
      });
    } finally {
      connection.release();
    }
  }
  ,
  getOrdersByCustomer: async (req, res) => {
    try {
      const customerId = req.params.customerId;
      if (!customerId) {
        return res.status(400).json({ error: "Missing customer ID" });
      }

      const orders = await ordersModel.getOrdersByCustomerId(customerId);

      res.json({ orders });
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default ordersController;
