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

  bulkAddOrderItems: async (orderItems) => {
    await DB.query(
      `INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
       VALUES ?`,
      [orderItems]
    );
  },
getOrdersByCustomerId: async (customerId) => {
  const [orders] = await DB.query(
    `SELECT o.order_id, o.total_price, o.order_date, o.status,
            oi.coupon_id, oi.quantity, oi.price_per_unit, oi.total_price as item_total_price
     FROM orders o
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     WHERE o.customer_id = ?
     ORDER BY o.order_date DESC`,
    [customerId]
  );
  return orders;
}

};

export default ordersModel;
