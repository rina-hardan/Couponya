import ordersModel from "../models/orderModels.js";

const ordersController = {
  createOrder: async (req, res) => {
    try {
      const { customerId, items, usePoints } = req.body;

      if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing required data" });
      }
      let totalPrice = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

      const currentPoints = await ordersModel.getCustomerPoints(customerId);

      let pointsUsed = 0;
      if (usePoints) {
        pointsUsed = Math.min(currentPoints, totalPrice);
        totalPrice -= pointsUsed;
      }

      const pointsEarned = Math.floor(totalPrice * 0.05);
      const updatedPoints = currentPoints - pointsUsed + pointsEarned;

      const orderDate = new Date();
      const orderId = await ordersModel.createOrder(customerId, totalPrice, orderDate);

      for (const item of items) {
        const itemTotal = item.pricePerUnit * item.quantity;
        await ordersModel.addOrderItem(orderId, item.couponId, item.quantity, item.pricePerUnit, itemTotal);
      }

      await ordersModel.updateCustomerPoints(customerId, updatedPoints);

      res.status(201).json({
        message: "Order created successfully",
        orderId,
        pointsUsed,
        pointsEarned,
        updatedPoints
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default ordersController;
