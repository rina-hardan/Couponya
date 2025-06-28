import ordersModel from "../models/orderModels.js";
import couponsModel from "../models/couponModels.js";
import usersModel from "../models/usersModels.js";
import sendMail from "../utils/mailer.js";
import DB from "../DB/DBconnection.js";
import cartModel from "../models/cartModel.js";

const ordersController = {
  createOrder: async (req, res) => {
    const { items, usePoints } = req.body;
    const customerId = req.userId;
    const customerEmail = req.email;
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing required data" });
    }
    const customer = await usersModel.getUserByEmail(customerEmail);
    const connection = await DB.getConnection();
    try {

      let totalPrice = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
     
      let remainingPoints = 0;
      if (usePoints) {
        const currentPoints = customer.points;
        if (currentPoints) {
          if (totalPrice >= currentPoints) {
            totalPrice -= currentPoints;
            remainingPoints = 0;
          } else {
            remainingPoints = currentPoints - totalPrice;
            totalPrice = 0;
          }
        }
      }
        const pointsEarned = Math.floor(totalPrice * 0.05);
        const updatedPoints = remainingPoints+ pointsEarned;

        const orderDate = new Date();
        const birthDate = new Date(customer.birth_date);


        if (orderDate.getMonth() == birthDate.getMonth())
          totalPrice *= 0.9; // 10% discount if order is made in the customer's birth month
        await connection.beginTransaction();
        const orderId = await ordersModel.createOrder(customerId, totalPrice, orderDate, connection);

        const orderItems = items.map(item => [
          orderId,
          item.couponId,
          item.quantity,
          item.pricePerUnit,
          item.pricePerUnit * item.quantity,
        ]);

        await ordersModel.bulkAddOrderItems(orderItems, connection);
        await couponsModel.updateCouponQuantities(items, connection);
        // await ordersModel.updateCustomerPoints(customerId, updatedPoints, connection);
        // לסיים את הטרנזקציה
        await connection.commit();
        const couponIds = items.map(item => item.couponId);
        const coupons = await couponsModel.getCouponsByIds(couponIds);
        const couponCodesAndTitles = coupons.map(c => `${c.code} - ${c.title}`).join(", ");


        await usersModel.updateCustomerPoints(customerId,updatedPoints);

        await cartModel.clearCart(customerId);
        const emailText = `Thank you for your order! Your coupon codes are:\n${couponCodesAndTitles}`;
        await sendMail(customerEmail, "Your Coupons", emailText);

        res.status(201).json({
          message: "Order created and email sent successfully",
          orderId,
          totalPrice,
          pointsEarned,
          updatedPoints,
          orderItems
        });

      } catch (error) {
        await connection.rollback();

        console.error("Error during order creation:", error.message);

        res.status(500).json({
          message: "Something went wrong while creating your order. Please try again later."
        });
      } finally {
        connection.release();
      }
    }
  ,
  getOrdersByCustomer: async (req, res) => {
    try {
      const customerId = req.userId;
      if (!customerId) {
        return res.status(400).json({ error: "Missing customer ID" });
      }
      const {
        sort = "order_date_desc",
        page = 1,
        limit = 10
      } = req.query;

       const offset = (page - 1) * limit;

      const orders = await ordersModel.getOrdersByCustomerId({
        customerId,
        sort,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // const orders = await ordersModel.getOrdersByCustomerId(customerId);

      res.json({ orders });
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ message: "Error getting orders" });
    }
  }
};

export default ordersController;
