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
// getOrdersByCustomerId: async (customerId) => {
//   const [orders] = await DB.query(
//     `SELECT o.order_id, o.total_price, o.order_date, o.status,
//             oi.coupon_id, oi.quantity, oi.price_per_unit, oi.total_price as item_total_price
//      FROM orders o
//      LEFT JOIN order_items oi ON o.order_id = oi.order_id
//      WHERE o.customer_id = ?
//      ORDER BY o.order_date DESC`,
//     [customerId]
//   );
//   return orders;
// }
getOrdersByCustomerId: async ({ customerId, sort }) => {
  let query = `
    SELECT o.id as order_id, o.total_price, o.order_date,
           oi.coupon_id, oi.quantity, oi.price_per_unit, oi.total_price as item_total_price,
           c.title as coupon_title
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN coupons c ON oi.coupon_id = c.id
    WHERE o.customer_id = ?
  `;

  const params = [customerId];

  let sortField = "order_date";
  let sortDirection = "DESC";

  const underscoreIndex = sort.lastIndexOf("_");
  if (underscoreIndex !== -1) {
    const field = sort.slice(0, underscoreIndex);
    const dir = sort.slice(underscoreIndex + 1);

    const validSortFields = ["order_date", "total_price"];
    const validDirections = ["asc", "desc"];

    if (validSortFields.includes(field) && validDirections.includes(dir.toLowerCase())) {
      sortField = field;
      sortDirection = dir.toUpperCase();
    }
  }

  query += ` ORDER BY o.${sortField} ${sortDirection}`;

  const [rows] = await DB.query(query, params);

  const ordersMap = {};
  for (const row of rows) {
    if (!ordersMap[row.order_id]) {
      ordersMap[row.order_id] = {
        id: row.order_id,
        total_price: row.total_price,
        order_date: row.order_date,
        items: [],
      };
    }
    ordersMap[row.order_id].items.push({
      coupon_id: row.coupon_id,
      title: row.coupon_title,
      quantity: row.quantity,
      price_per_unit: row.price_per_unit,
      item_total_price: row.item_total_price,
    });
  }

  return Object.values(ordersMap);
}

};

export default ordersModel;
