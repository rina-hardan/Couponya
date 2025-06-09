import DB from "../DB/DBconnection.js";

const ordersModel = {
  getCustomerPoints: async (customerId) => {
    const [rows] = await DB.query("SELECT points FROM customers WHERE customer_id = ?", [customerId]);
    return rows.length > 0 ? rows[0].points : 0;
  },

  updateCustomerPoints: async (customerId, points) => {
    await DB.query("UPDATE customers SET points = ? WHERE customer_id = ?", [points, customerId]);
  },

  createOrder: async (customerId, totalPrice, orderDate) => {
    const [result] = await DB.query(
      "INSERT INTO orders (customer_id, total_price, order_date) VALUES (?, ?, ?)",
      [customerId, totalPrice, orderDate]
    );
    return result.insertId;
  },

  addOrderItem: async (orderId, couponId, quantity, pricePerUnit, totalPrice) => {
    await DB.query(
      `INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, couponId, quantity, pricePerUnit, totalPrice]
    );
  }
};

export default ordersModel;
