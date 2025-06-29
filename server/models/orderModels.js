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
  createOrderWithItemsAndCouponsUpdate: async (customerId, totalPrice, items) => {
  const connection = await DB.getConnection();
  try {
    await connection.beginTransaction();

    const orderDate = new Date();

    const [result] = await connection.query(
      "INSERT INTO orders (customer_id, total_price, order_date) VALUES (?, ?, ?)",
      [customerId, totalPrice, orderDate]
    );
    const orderId = result.insertId;

    const orderItems = items.map(item => [
      orderId,
      item.couponId,
      item.quantity,
      item.pricePerUnit,
      item.pricePerUnit * item.quantity,
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES ?`,
      [orderItems]
    );

    for (const item of items) {
      await connection.query(
        `UPDATE coupons SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`,
        [item.quantity, item.couponId, item.quantity]
      );
    }

    await connection.commit();
    connection.release();

    return { orderId, orderItems };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
},

getOrdersByCustomerId: async ({ customerId, sort, limit = 10, offset = 0 }) => {
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

  const query = `
    SELECT 
      o.id AS order_id,
      o.total_price,
      o.order_date,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'coupon_id', oi.coupon_id,
          'title', c.title,
          'quantity', oi.quantity,
          'price_per_unit', oi.price_per_unit,
          'item_total_price', oi.total_price
        )
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN coupons c ON oi.coupon_id = c.id
    WHERE o.customer_id = ?
    GROUP BY o.id
    ORDER BY o.${sortField} ${sortDirection}
    LIMIT ? OFFSET ?
  `;

  const [rows] = await DB.query(query, [customerId, parseInt(limit), parseInt(offset)]);

  return rows.map(row => ({
    id: row.order_id,
    total_price: row.total_price,
    order_date: row.order_date,
    items: row.items
  }));
}
};

export default ordersModel;
