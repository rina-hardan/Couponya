import ordersModel from "../models/orderModels.js";
import couponsModel from "../models/couponModels.js";
import sendMail from "../utils/mailer.js";
import DB from "../DB/DBconnection.js";

const ordersController = {
 createOrder: async (req, res) => {
  const connection = await DB.getConnection();
  try {
    await connection.beginTransaction();

    const { customerId, items, usePoints } = req.body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required data" });
    }

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
    const coupons = await couponsModel.getCouponsByIds(couponIds, connection); // תחזירי רק id ו-code
      const couponCodes = coupons.map(c => c.code).join(", ");
      
    const emailText = `תודה על ההזמנה! הקופונים שלך הם:\n${couponCodes}`;

    await sendMail("rina616235@gmail.com", "הקופונים שלך", emailText);

    await connection.commit();

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
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
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
      sort = "created_at_desc", // ברירת מחדל
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
