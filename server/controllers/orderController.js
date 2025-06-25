import ordersModel from "../models/orderModels.js";
import couponsModel from "../models/couponModels.js";
import sendMail from "../utils/mailer.js";
import DB from "../DB/DBconnection.js";

const ordersController = {
  createOrder: async (req, res) => {
    const { items, usePoints,customerBirthDate } = req.body;
   
    const customerId = req.userId;
    const customerEmail = req.email;
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
      const birthDate = new Date(customerBirthDate);
      

      if(orderDate.getMonth()==birthDate.getMonth())
        totalPrice *= 0.9; // 10% discount if order is made in the customer's birth month
    // להתחיל טרנזקציה
      const orderId = await ordersModel.createOrder(customerId, totalPrice, orderDate, connection);

      const orderItems = items.map(item => [
        orderId,
        item.couponId,
        item.quantity,
        item.pricePerUnit,
        item.pricePerUnit * item.quantity,
      ]);

      await ordersModel.bulkAddOrderItems(orderItems, connection);
      await ordersModel.updateCustomerPoints(customerId, updatedPoints, connection);
// לסיים את הטרנזקציה
    const couponIds = items.map(item => item.couponId);
    const coupons = await couponsModel.getCouponsByIds(couponIds, connection); 
    const couponCodesAndTitles = coupons.map(c => `${c.code} - ${c.title}`).join(", ");

      await connection.commit();

      const emailText = `Thank you for your order! Your coupon codes are:\n${couponCodesAndTitles}`;
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
    const customerId = req.userId;
    if (!customerId) {
      return res.status(400).json({ error: "Missing customer ID" });
    }
 const {
      status,
      sort = "created_at_desc", 
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
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default ordersController;
